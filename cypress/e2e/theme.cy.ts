/// <reference types="cypress" />

describe("Theme", () => {
    beforeEach(() => {
        cy.visit("/");
        cy.window().then(win => {
            cy.stub(win, "matchMedia")
                .withArgs("(prefers-color-scheme: dark)")
                .returns({
                    matches: false,
                    addListener: () => {},
                    removeListener: () => {},
                });
        });
    });

    it("should display the theme button", () => {
        cy.getByTestId("theme-button").should("exist");
    });

    it("should apply light theme based on system preference", () => {
        cy.get("html").should("have.class", "light");
    });

    it("should open and close the theme popover", () => {
        cy.getByTestId("theme-button").click();
        cy.get("[data-radix-menu-content]").should("exist");
        cy.get("body").click(0, 0);
        cy.get("[data-radix-menu-content]").should("not.exist");
    });

    it("should display light, dark, and system theme options in the popover", () => {
        cy.getByTestId("theme-button").click();
        cy.getByTestId("theme-button-light").should("exist");
        cy.getByTestId("theme-button-dark").should("exist");
        cy.getByTestId("theme-button-system").should("exist");
    });

    it("should switch to dark theme when dark mode is selected", () => {
        cy.getByTestId("theme-button").click();
        cy.getByTestId("theme-button-dark").click();
        cy.get("html").should("have.class", "dark");
    });

    it("should switch to light theme when light mode is selected", () => {
        cy.getByTestId("theme-button").click();
        cy.getByTestId("theme-button-light").click();
        cy.get("html").should("have.class", "light");
    });

    it("should switch to system theme when system mode is selected", () => {
        cy.getByTestId("theme-button").click();
        cy.getByTestId("theme-button-system").click();
        cy.get("html").should("have.class", "light");
    });

    it("should persist dark theme after page reload", () => {
        cy.getByTestId("theme-button").click();
        cy.getByTestId("theme-button-dark").click();
        cy.reload();
        cy.get("html").should("have.class", "dark");
    });

    it("should save the selected theme to local storage", () => {
        cy.getByTestId("theme-button").click();
        cy.getByTestId("theme-button-dark").click();

        cy.window().then(win => {
            expect(win.localStorage.getItem("THEME")).to.equal("dark");
        });
    });
});
