import { DOCUMENT_TYPE_FIELD_INDEX, DOCUMENT_NUMBER_FIELD_INDEX, DOCUMENT_NAME_FIELD_INDEX, DOCUMENT_DATE_FIELD_INDEX } from './const/constants.js'

describe('Проверка работы фильтров', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.get('.reactable-th-foei\\:typegsi > .btn-group > .form-control').as('documentTypeSelect');
        cy.get('.reactable-th-foei\\:numbergsi > .btn-group > .form-control').as('documentNumberInput');
        cy.get('.reactable-th-foei\\:namegsi > .btn-group > .form-control').as('documentNameInput');

        // cy.get('.reactable-data').as('recievedData');
        cy.get('.pull-left > :nth-child(1) > :nth-child(4)').as('pageCount');
        cy.get('.pull-left > :nth-child(1) > :nth-child(4)').as('totalRecordCount');

        cy.get('.pull-right').contains('»').as('nextPageButton');
        cy.get('.pull-right').contains('«').as('previousPageButton');
    });

    describe('Проверка фильтра “Вид документа”', () => {
        it.skip('Фильтр применяется корректно', () => {

            cy.get('@documentTypeSelect').then(($select) => {
                const optionCount = $select.find('option').length;
                const options = $select.find('option').map((_index, opt) => opt.textContent).toArray();
                // first option is empty and has no effect on filter
                for (let i = 1; i < optionCount; i++) {
                    cy.get('@documentTypeSelect').select(i);
                    cy.intercept('GET', '**/fundmetrology/api/registry/3/data*').as(`getData${i}`);
                    cy.wait(`@getData${i}`);

                    cy.get('@recievedData').then(($recievedData) => {
                        const recordCountOnPage = $recievedData.find('tr').length;
                        cy.log(`recordCountOnPage: ${recordCountOnPage}`);
                        for (let j = 1; j <= recordCountOnPage; j++) {
                            cy.get(`.reactable-data > :nth-child(${j}) > :nth-child(${DOCUMENT_TYPE_FIELD_INDEX}) > span`).should('have.text', options[i]);
                        }
                    })
                }
            })
        })
    })

    describe('Проверка фильтра “Номер”', () => {
        beforeEach(() => {
            cy.get(`.reactable-data > :nth-child(1) > :nth-child(${DOCUMENT_NUMBER_FIELD_INDEX}) > span`).as('firstRecordNumberDOMElement');
        });

        it.skip('Поиск номера документа по существующему и полностью совпадающему работает корректно', () => {
            cy.get('@firstRecordNumberDOMElement').then(($gsiNumber) => {
                const gsiNumber = $gsiNumber.text();
                cy.baseFindDocumentNumber(gsiNumber, gsiNumber);

                cy.get('@recievedData').find('tr').should('have.length', '1');
            });
        })

        it.skip('Поиск номера документа по существующему и полностью совпадающему с пробелами до и после названия работает корректно', () => {
            cy.get('@firstRecordNumberDOMElement').then(($gsiNumber) => {
                const gsiNumber = $gsiNumber.text();
                cy.baseFindDocumentNumber(`\t ${gsiNumber} \t `, gsiNumber);

                cy.get('@recievedData').find('tr').should('have.length', '1');
            });
        })

        it.skip('Сброс фильтра работает корректно', () => {
            cy.get('@firstRecordNumberDOMElement').then(($gsiNumber) => {
                const gsiNumber = $gsiNumber.text();
                cy.baseFindDocumentNumber(gsiNumber, gsiNumber);

                cy.get('.reactable-th-foei\\:numbergsi > .btn-group > .searchclear').click();

                cy.get('@documentNumberInput').should('be.empty');
                cy.get('@recievedData').find('tr').should('have.length.above', 1);

            });
        })

    });

    describe('Проверка фильтра “Наименование”', () => {
        beforeEach(() => {
            cy.get(`.reactable-data > :nth-child(1) > :nth-child(${DOCUMENT_NAME_FIELD_INDEX}) > span`).as('firstRecordNameDOMElement');
        });

        it.skip('Поиск наименования документа по существующему и полностью совпадающему работает корректно', () => {
            cy.get('@firstRecordNameDOMElement').then(($gsiName) => {
                const gsiName = $gsiName.text();
                cy.baseFindDocumentName(gsiName, gsiName);
            });
        })

        it.skip('Поиск наименования документа по существующему и полностью совпадающему с пробелами до и после названия работает корректно', () => {
            cy.get('@firstRecordNameDOMElement').then(($gsiName) => {
                const gsiName = $gsiName.text();
                cy.baseFindDocumentName(`\t ${gsiName} \t `, gsiName);
            });
        })

        it.skip('Сброс фильтра работает корректно', () => {
            cy.get('@firstRecordNameDOMElement').then(($gsiName) => {
                const gsiName = $gsiName.text();
                cy.baseFindDocumentName(gsiName, gsiName);

                cy.get('.reactable-th-foei\\:namegsi > div > span').click();
                cy.get('@documentNameInput').should('be.empty');
                cy.get('@recievedData').find('tr').should('have.length.above', 1);

            });
        })

    });


    describe('Проверка фильтра “Дата введения”', () => {

        it('Проверка работы по дате введения документа ОТ некоторой даты', () => {
            const typedDate = new Date('2024-01-01').getTime();

            cy.intercept('GET', '**/fundmetrology/api/registry/3/data*').as('getData_documentDateFromInput');
            
            cy.get(':nth-child(1) > .react-datepicker__input-container > .form-control').as('documentDateFromInput');
            cy.get('@documentDateFromInput').type('01.01.2024');
            cy.wait('@getData_documentDateFromInput');

            cy.get('.reactable-data').then(($recievedData) => {
                const recordCountOnPage = $recievedData.find('tr').length;
                cy.log(`recordCountOnPage: ${recordCountOnPage}`);
                for (let j = 1; j <= recordCountOnPage; j++) {
                    cy.get(`.reactable-data > :nth-child(${j}) > :nth-child(${DOCUMENT_DATE_FIELD_INDEX}) > span`).then(($recordDate) => {
                        const dateText = $recordDate.text().trim();

                        // "DD.MM.YYYY" -> "YYYY-MM-DD"
                        const [day, month, year] = dateText.split('.');
                        const formattedDate = `${year}-${month}-${day}`;

                        const date = new Date(formattedDate).getTime();

                        cy.wrap(date).should('be.at.least', typedDate); // date more than or equal to typedDate
                    })
                }
            })
        })

        it('Проверка работы по дате введения документа ДО некоторой даты', () => {
            const typedDate = new Date('2024-01-01').getTime();

            cy.get(':nth-child(3) > .react-datepicker__input-container > .form-control').as('documentDateToInput');

            cy.intercept('GET', '**/fundmetrology/api/registry/3/data*').as('getData_documentDateToInput');

            cy.get('@documentDateToInput').type('01.01.2024');
            cy.wait('@getData_documentDateToInput');
            cy.wait(4000);
            cy.get('.reactable-data').then(($recievedData) => {
                const recordCountOnPage = $recievedData.find('tr').length;
                cy.log(`recordCountOnPage: ${recordCountOnPage}`);
                for (let j = 1; j <= recordCountOnPage; j++) {
                    cy.get(`.reactable-data > :nth-child(${j}) > :nth-child(${DOCUMENT_DATE_FIELD_INDEX}) > span`).then(($recordDate) => {
                        const dateText = $recordDate.text().trim();

                        // "DD.MM.YYYY" -> "YYYY-MM-DD"
                        const [day, month, year] = dateText.split('.');
                        const formattedDate = `${year}-${month}-${day}`;

                        const date = new Date(formattedDate).getTime();

                        cy.wrap(date).should('be.at.most', typedDate); // date less than or equal to typedDate
                    })
                }
            })
        })

        // it('Сброс фильтра работает корректно', () => {
        //     cy.get('@firstRecordNameDOMElement').then(($gsiName) => {
        //         const gsiName = $gsiName.text();
        //         cy.baseFindDocumentName(gsiName, gsiName);

        //         cy.get('.reactable-th-foei\\:namegsi > div > span').click();
        //         cy.get('@documentNameInput').should('be.empty');
        //         cy.get('@recievedData').find('tr').should('have.length.above', 1);

        //     });
        // })

    });


})