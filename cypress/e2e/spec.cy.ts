/// <reference types="cypress" />

describe("template spec", () => {
    it("passes", () => {
        cy.visit("http://localhost:5173");
        cy.get("[data-testid='day-3-10']").click();
        cy.get("[data-testid='title-input']").type("Test event");
        cy.get("[data-testid='description-input']").type("Test description");
        cy.get("[data-testid='radio-label-green']").click();
        cy.get("[data-testid='save-form-button']").click();
    });
});
