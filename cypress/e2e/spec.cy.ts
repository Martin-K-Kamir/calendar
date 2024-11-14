/// <reference types="cypress" />

describe("calendar", () => {
    const YEAR = 2024;
    const MONTH = 10;
    const DAY = 7;
    const fixedDate = new Date(YEAR, MONTH, DAY);

    const events = [
        {
            title: "Test Event 1",
            description: "",
            color: "pink",
            id: "25cc800b-09e0-4e84-9df0-3cc0d23376d3",
            kind: "FULL_DAY_EVENT",
            from: "2024-10-31T23:00:00.000Z",
            to: "2024-11-02T23:00:00.000Z",
        },
        {
            title: "Test Event 4",
            description: "",
            color: "indigo",
            kind: "FULL_DAY_EVENT",
            from: "2024-12-09T23:00:00.000Z",
            to: "2024-12-12T23:00:00.000Z",
            id: "6337b477-645f-4277-8958-915709321162",
        },
        {
            title: "Test Event 3",
            description: "",
            color: "pink",
            date: "2024-10-09T22:00:00.000Z",
            kind: "DAY_EVENT",
            startTime: "2024-11-14T23:15:00.000Z",
            endTime: "2024-11-15T00:15:00.000Z",
            id: "251510d6-d0a2-4c74-b583-1627a29d7c15",
        },
        {
            title: "Test Leap Event 1",
            description: "",
            color: "pink",
            id: "7716670f-fe50-4c92-82e6-1e5827cb1a7b",
            date: "2024-10-28T23:00:00.000Z",
            kind: "DAY_EVENT",
            startTime: "2024-11-14T23:15:00.000Z",
            endTime: "2024-11-15T00:15:00.000Z",
        },
        {
            title: "Test Leap Event 2",
            description: "",
            color: "pink",
            date: "2024-11-29T23:00:00.000Z",
            kind: "DAY_EVENT",
            startTime: "2024-11-14T23:15:00.000Z",
            endTime: "2024-11-15T00:15:00.000Z",
            id: "542e9594-b642-474f-ab2b-2761c66b82f5",
        },
        {
            title: "Test Event 2",
            description: "",
            color: "pink",
            id: "ee53b007-169f-4129-9243-fc0e11c5d739",
            date: "2024-11-06T23:00:00.000Z",
            kind: "DAY_EVENT",
            startTime: "2024-11-15T09:00:00.000Z",
            endTime: "2024-11-15T10:00:00.000Z",
        },
    ];

    beforeEach(() => {
        cy.visit("/");
        cy.clock(fixedDate.getTime());
        cy.mockDateTimeFormat();

        cy.window().then(win => {
            win.localStorage.setItem("EVENTS", JSON.stringify(events));
        });
    });

    it("renders current month and year", () => {
        cy.contains(`November ${YEAR}`);
    });

    it("renders week days", () => {
        cy.contains(/sun/i);
        cy.contains(/mon/i);
        cy.contains(/tue/i);
        cy.contains(/wed/i);
        cy.contains(/thu/i);
        cy.contains(/fri/i);
        cy.contains(/sat/i);
    });

    it("renders calendar days of current month", () => {
        const startDate = new Date(YEAR, 9, 28);
        const endDate = new Date(YEAR, 11, 1);

        for (
            let date = startDate;
            date <= endDate;
            date.setDate(date.getDate() + 1)
        ) {
            const day = date.getDate();
            const month = date.toLocaleString("en-GB", { month: "short" });

            if (day === 1 && month === "Nov") {
                cy.contains(`${day}. ${month}`);
            } else if (day === 1 && month === "Dec") {
                cy.contains(`${day}. ${month}`);
            } else {
                cy.contains(day.toString());
            }
        }
    });

    it("highlight current day", () => {
        const currentDayTestId = `day-${fixedDate.getDate()}-${fixedDate.getMonth()}`;

        cy.getByTestId(currentDayTestId).should("have.class", "bg-blue-500");

        cy.get("[data-testid^='day-']")
            .not(`[data-testid='${currentDayTestId}']`)
            .each($el => {
                cy.wrap($el).should("not.have.class", "bg-blue-500");
            });
    });

    it("navigates to next month", () => {
        cy.getByTestId("next-month-button").click();
        cy.contains(`December ${YEAR}`);
    });

    it("navigates to previous month", () => {
        cy.getByTestId("previous-month-button").click();
        cy.contains(`October ${YEAR}`);
    });

    it("navigates back to current month", () => {
        cy.getByTestId("previous-month-button").click();
        cy.getByTestId("previous-month-button").click();
        cy.getByTestId("previous-month-button").click();
        cy.getByTestId("previous-month-button").click();
        cy.getByTestId("today-button").click();
        cy.contains(`November ${YEAR}`);
    });

    it("previous or next month should not have current day highlighted", () => {
        cy.getByTestId("previous-month-button").click();
        cy.get("[data-testid^='day-']").should("not.have.class", "bg-blue-500");

        cy.getByTestId("next-month-button").click();
        cy.getByTestId("next-month-button").click();
        cy.get("[data-testid^='day-']").should("not.have.class", "bg-blue-500");
    });

    it("renders calendar events", () => {
        cy.contains("Test Event 1");
        cy.contains("Test Event 2");
    });

    it("renders leap events", () => {
        cy.contains("Test Leap Event 1");
        cy.contains("Test Leap Event 2");
        cy.getByTestId("previous-month-button").click();
        cy.contains("Test Leap Event 1");
        cy.contains("Test Leap Event 2").should("not.exist");
        cy.getByTestId("next-month-button").click();
        cy.getByTestId("next-month-button").click();
        cy.contains("Test Leap Event 1").should("not.exist");
        cy.contains("Test Leap Event 2");
    });

    it("should not render events from other months", () => {
        cy.contains("Test Event 3").should("not.exist");
        cy.contains("Test Event 4").should("not.exist");

        cy.getByTestId("previous-month-button").click();
        cy.contains("Test Event 3");
        cy.contains("Test Event 4").should("not.exist");

        cy.getByTestId("next-month-button").click();
        cy.getByTestId("next-month-button").click();
        cy.contains("Test Event 3").should("not.exist");
        cy.contains("Test Event 4");
    });

    describe("Sorting full day events", () => {
        it("sorts events by date", () => {
            const events = [
                {
                    title: "Test Event 1",
                    description: "",
                    color: "pink",
                    id: "ef16ec9f-5a05-431d-81dc-8eb756df4470",
                    kind: "FULL_DAY_EVENT",
                    from: "2024-11-03T23:00:00.000Z",
                    to: "2024-11-06T23:00:00.000Z",
                },
                {
                    title: "Test Event 2",
                    description: "",
                    color: "pink",
                    kind: "FULL_DAY_EVENT",
                    from: "2024-11-04T23:00:00.000Z",
                    to: "2024-11-09T23:00:00.000Z",
                    id: "c1b9cd5e-a2fa-4afd-a3a4-bf068abcb551",
                },
            ];

            cy.window().then(win => {
                win.localStorage.setItem("EVENTS", JSON.stringify(events));
            });

            cy.visit("/");

            cy.contains("Test Event 1");
            cy.contains("Test Event 2");
        });
    });

    // it("passes", () => {
    //     cy.getByTestId("day-3-10").click();
    //     cy.getByTestId("title-input").type("Test event");
    //     cy.getByTestId("description-input").type("Test description");
    //     cy.getByTestId("radio-label-green").click();
    //     cy.getByTestId("save-form-button").click();
    // });
});
