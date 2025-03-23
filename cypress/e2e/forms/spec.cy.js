describe("Страница “Стандарты государственной системы обеспечения единства измерений”", () => {


    describe('Проверка отображения выбранного фильтра в столбце: “Вид документа”', () => {
        beforeEach(() => {
            cy.visit('/');
        });

        it('Поле "Вид документа" отображается и пустое.', () => {
            cy.get('.reactable-th-foei\\:typegsi > .btn-group > .form-control').as('documentTypeSelect');
            cy.get('@documentTypeSelect').focus();
            cy.get('@documentTypeSelect').should('be.visible');
            cy.get('@documentTypeSelect').then(function ($select) {
                var index = $select[0].selectedIndex;
                cy.wrap(index).should("equal", 0);
            });
            cy.get('@documentTypeSelect').find('option').first().should('have.text', '');
        });

        it('Отображается выпадающий список со значениями, в том числе пустая строка.', () => {
            cy.get('.reactable-th-foei\\:typegsi > .btn-group > .form-control').as('documentTypeSelect');

            cy.get('@documentTypeSelect')
                .find('option')
                .should('contain', '')
                .and('have.length.greaterThan', 1);
        });

        it('Выбор значения в выпадающем списке "Вид документа".', () => {
            cy.get('.reactable-th-foei\\:typegsi > .btn-group > .form-control').as('documentTypeSelect');

            const typeGsi_1 = 'Стандарты ГСИ на методы испытаний средств измерений';

            cy.get('@documentTypeSelect').select(typeGsi_1);
            cy.get('@documentTypeSelect').find('option:selected').should('have.text', typeGsi_1);
        });

        it('Выбор пустого значения в выпадающем списке "Вид документа" после выбора непустого значения.', () => {
            cy.get('.reactable-th-foei\\:typegsi > .btn-group > .form-control').as('documentTypeSelect');
            const typeGsi_1 = 'Стандарты ГСИ на методы испытаний средств измерений';

            cy.get('@documentTypeSelect').select(typeGsi_1);
            cy.get('@documentTypeSelect').select('');
            cy.get('@documentTypeSelect').find('option:selected').should('have.text', '');
        });
    })
});
