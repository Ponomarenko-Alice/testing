describe("Страница “Стандарты государственной системы обеспечения единства измерений”", () => {


    describe('Проверка отображения выбранного фильтра в столбце: “Вид документа”', () => {
        beforeEach(() => {
            cy.visit('/');
            cy.get('.reactable-th-foei\\:typegsi > .btn-group > .form-control').as('documentTypeSelect');
        });

        it('Поле "Вид документа" отображается и пустое.', () => {
            cy.get('@documentTypeSelect').focus();
            cy.get('@documentTypeSelect').should('be.visible');
            cy.get('@documentTypeSelect').then(function ($select) {
                var index = $select[0].selectedIndex;
                cy.wrap(index).should("equal", 0);
            });
            cy.get('@documentTypeSelect').find('option').first().should('have.text', '');
        });

        it('Отображается выпадающий список со значениями, в том числе пустая строка.', () => {
            cy.get('@documentTypeSelect')
                .find('option')
                .should('contain', '')
                .and('have.length.greaterThan', 1);
        });

        it('Выбор значения в выпадающем списке "Вид документа".', () => {
            const typeGsi_1 = 'Стандарты ГСИ на методы испытаний средств измерений';

            cy.get('@documentTypeSelect').select(typeGsi_1);
            cy.get('@documentTypeSelect').find('option:selected').should('have.text', typeGsi_1);
        });

        it('Выбор пустого значения в выпадающем списке "Вид документа" после выбора непустого значения.', () => {
            const typeGsi_1 = 'Стандарты ГСИ на методы испытаний средств измерений';

            cy.get('@documentTypeSelect').select(typeGsi_1);
            cy.get('@documentTypeSelect').select('');
            cy.get('@documentTypeSelect').find('option:selected').should('have.text', '');
        });

        it.only('Выбор значения в выпадающем списке "Вид документа" с помощью клавиш.', () => {


            // cy.get('@documentTypeSelect').then(function ($select) {
            //     cy.get('@documentTypeSelect').focus();

            //     const options = Array.from($select[0].options).map(opt => opt.value);
            //     const indexCount = options.length;

            //     for (let i = 0; i < indexCount - 1; i++) {
            //         cy.wrap($select).type('{downarrow}').wait(500);
            //         cy.log(options[i]);
            //         cy.wrap($select).invoke('val').find('option:selected').should('have.text', options[i + 1]);

            //     }
            //     for (let i = indexCount - 2; i >= 0; i--) {
            //         cy.wrap($select).type('{uparrow}').wait(500);
            //         cy.wrap($select).invoke('val').should('eq', options[i].value);
            //         cy.log(options[i]);
            // }
            // });


            cy.get('@documentTypeSelect')
                .focus().then(function ($select) {
                const options = Array.from($select[0].options).map(opt => opt.value);

                cy.wrap(options).should('have.length.greaterThan', 1);

                // cy.wrap($select).focus();
                cy.wrap().type('{downarrow}', { timeout: 8000 }).wait(500);
                cy.log(options[1]);

                cy.wrap($select).type('{downarrow}', { timeout: 8000 }).wait(500);
                cy.wrap($select).invoke('val').should('eq', options[2]);
                cy.log(options[2]);
            });
        });
    })


    describe('Проверка отображения выбранного фильтра в столбце: “Номер”', () => {

        beforeEach(() => {
            cy.visit('/');
            cy.get('.reactable-th-foei\\:numbergsi > .btn-group > .form-control').as('documentNumberField');
        });

        it('kkjkk', ()=> {
            cy.get('@documentNumberField').should('have.text', '');
        })
        
        it('Проверка допустимых символов для ввода', ()=> {
            cy.get('@documentNumberField').should('have.text', '');
        })
    });
});
