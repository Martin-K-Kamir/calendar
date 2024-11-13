/// <reference types="cypress" />

describe("template spec", () => {
    it("passes", () => {
        cy.visit("http://localhost:5173");
        cy.get("[data-testid='day-3-10']").click();
        cy.get("[data-testid='titleInput']").type("Test event");
        cy.get("[data-testid='descriptionInput']").type("Test description");
        cy.get("[data-testid='radio-label-green']").click();
        cy.get("[data-testid='saveFormButton']").click();
    });
});
