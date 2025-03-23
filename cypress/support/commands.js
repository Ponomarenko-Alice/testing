// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import { DOCUMENT_NUMBER_FIELD_INDEX, DOCUMENT_NAME_FIELD_INDEX } from '../e2e/filters/const/constants'

/**
 * @param typedText != expectedText in case typed text should be changed before searching
 * @param expectedText == typedText by default
 */
Cypress.Commands.add('baseFindDocumentNumber', (typedText, expectedText) => {
    cy.get('@documentNumberInput').type(typedText);
    cy.intercept('GET', '**/fundmetrology/api/registry/3/data*').as(`getData_baseFindDocumentNumber`);
    cy.wait('@getData_baseFindDocumentNumber');
    cy.get('@recievedData').then(($recievedData) => {
        if ($recievedData.find('tr') == null) {
            cy.log(`No records found with number ${typedText}`)
        } else {
            // for each contains text
            cy.get(`.reactable-data > :nth-child(1) > :nth-child(${DOCUMENT_NUMBER_FIELD_INDEX})`).contains(expectedText);

        }
    })
});


/**
 * @param typedText != expectedText in case typed text should be changed before searching
 * @param expectedText == typedText by default
 */
Cypress.Commands.add('baseFindDocumentName', (typedText, expectedText) => {
    cy.get('@documentNameInput').type(typedText);
    cy.intercept('GET', '**/fundmetrology/api/registry/3/data*').as(`getData_baseFindDocumentName`);
    cy.wait('@getData_baseFindDocumentName');
    cy.get('@recievedData').then(($recievedData) => {
        if ($recievedData.find('tr') == null) {
            cy.log(`No records found with name ${typedText}`)
        } else {
            // for each contains text
            cy.get(`.reactable-data > :nth-child(1) > :nth-child(${DOCUMENT_NAME_FIELD_INDEX})`).contains(expectedText);

        }
    })
});