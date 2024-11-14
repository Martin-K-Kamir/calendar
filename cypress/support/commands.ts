/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
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
//
Cypress.Commands.add("getByTestId", (testId: string) => {
    return cy.get(`[data-testid='${testId}']`);
});

Cypress.Commands.add("mockDateTimeFormat", (locale = "en-GB") => {
    cy.window().then(win => {
        const originalDateTimeFormat = win.Intl.DateTimeFormat;

        win.Intl.DateTimeFormat = function (
            _: never,
            options: Record<string, any>
        ) {
            return new originalDateTimeFormat(locale, options);
        } as unknown as typeof Intl.DateTimeFormat;

        win.Intl.DateTimeFormat.supportedLocalesOf =
            originalDateTimeFormat.supportedLocalesOf;
    });
});

declare global {
    namespace Cypress {
        interface Chainable {
            getByTestId(testId: string): Chainable<JQuery<HTMLElement>>;
            mockDateTimeFormat(local?: string): Chainable<void>;
        }
    }
}

export {};
