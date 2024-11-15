/// <reference types="cypress" />

function createBaseEvent(title: string) {
    return {
        title,
        id: crypto.randomUUID(),
        description: "",
        color: "pink",
    };
}

function createDayEvent(
    title: string,
    date: Date,
    startTime: number,
    endTime: number
) {
    return {
        ...createBaseEvent(title),
        kind: "DAY_EVENT",
        date: date.toISOString(),
        startTime: new Date(date.setHours(startTime)).toISOString(),
        endTime: new Date(date.setHours(endTime)).toISOString(),
    };
}

function createFullDayEvent(title: string, from: Date, to: Date) {
    return {
        ...createBaseEvent(title),
        kind: "FULL_DAY_EVENT",
        from: from.toISOString(),
        to: to.toISOString(),
    };
}

function getLastWeekIndexOfMonth(selectedMonth: Date): number {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    return Math.ceil((daysInMonth + firstDayOfWeek) / 7) - 1;
}

const LOCALE = "en-GB";
const YEAR = 2024;
const MONTH = 10;
const DAY = 7;
const fixedDate = new Date(YEAR, MONTH, DAY);

const events = [
    createFullDayEvent(
        "Test Event 1",
        new Date(YEAR, MONTH, 5),
        new Date(YEAR, MONTH, 19)
    ),
    createDayEvent("Test Event 2", new Date(YEAR, MONTH, 7), 10, 11),
    createDayEvent("Test Event 3", new Date(YEAR, MONTH - 1, 10), 9, 10),
    createFullDayEvent(
        "Test Event 4",
        new Date(YEAR, MONTH + 1, 10),
        new Date(YEAR, MONTH + 1, 13)
    ),
    createDayEvent("Test Leap Event 1", new Date(YEAR, MONTH - 1, 29), 10, 11),
    createDayEvent("Test Leap Event 2", new Date(YEAR, MONTH, 30), 10, 11),
];

describe("Calendar", () => {
    beforeEach(() => {
        cy.visit("/");
        cy.clock(fixedDate.getTime());
        cy.mockDateTimeFormat(LOCALE);

        cy.window().then(win => {
            win.localStorage.setItem("EVENTS", JSON.stringify(events));
        });
    });

    it("displays the current month and year", () => {
        cy.contains(`November ${YEAR}`);
    });

    it("displays the week days", () => {
        cy.contains(/sun/i);
        cy.contains(/mon/i);
        cy.contains(/tue/i);
        cy.contains(/wed/i);
        cy.contains(/thu/i);
        cy.contains(/fri/i);
        cy.contains(/sat/i);
    });

    it("displays the calendar days of the current month", () => {
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

    it("highlights the current day in the calendar", () => {
        const currentDayTestId = `day-${fixedDate.getDate()}-${fixedDate.getMonth()}`;

        cy.getByTestId(currentDayTestId).should("have.class", "bg-blue-500");

        cy.get("[data-testid^='day-']")
            .not(`[data-testid='${currentDayTestId}']`)
            .each($el => {
                cy.wrap($el).should("not.have.class", "bg-blue-500");
            });
    });

    describe("Navigation", () => {
        it("navigates to the next month and displays it", () => {
            cy.getByTestId("next-month-button").click();
            cy.contains(`December ${YEAR}`);
        });

        it("navigates to the previous month and displays it", () => {
            cy.getByTestId("previous-month-button").click();
            cy.contains(`October ${YEAR}`);
        });

        it("navigates back to the current month and displays it", () => {
            cy.getByTestId("previous-month-button").click();
            cy.getByTestId("previous-month-button").click();
            cy.getByTestId("previous-month-button").click();
            cy.getByTestId("previous-month-button").click();
            cy.getByTestId("today-button").click();
            cy.contains(`November ${YEAR}`);
        });

        it("does not highlight the current day when viewing previous or next month", () => {
            cy.getByTestId("previous-month-button").click();
            cy.get("[data-testid^='day-']").should(
                "not.have.class",
                "bg-blue-500"
            );

            cy.getByTestId("next-month-button").click();
            cy.getByTestId("next-month-button").click();
            cy.get("[data-testid^='day-']").should(
                "not.have.class",
                "bg-blue-500"
            );
        });
    });

    describe("Events", () => {
        it("displays the calendar events", () => {
            cy.contains("Test Event 1");
            cy.contains("Test Event 2");
        });

        it("displays full day events correctly", () => {
            cy.getByTestId("events-list-1").within(() => {
                cy.contains("Test Event 1");
            });

            cy.getByTestId("events-list-2").within(() => {
                cy.contains("Test Event 1");
            });

            cy.getByTestId("events-list-3").within(() => {
                cy.contains("Test Event 1");
            });
        });

        it("displays full day events spanning multiple months correctly", () => {
            const FROM_MONTH = 9;
            const TO_MONTH = 4;
            let currentMonth = FROM_MONTH;
            let currentYear = YEAR;

            const events = [
                createFullDayEvent(
                    "Test Event 1",
                    new Date(YEAR, FROM_MONTH, 28),
                    new Date(YEAR + 1, TO_MONTH, 4)
                ),
            ];

            cy.window().then(win => {
                win.localStorage.setItem("EVENTS", JSON.stringify(events));
            });

            cy.visit("/");

            for (let i = 0; i <= Math.abs(FROM_MONTH - TO_MONTH); i++) {
                if (currentMonth % 12 === 0) {
                    currentMonth = 0;
                    currentYear++;
                }

                const lastWeekIndex = getLastWeekIndexOfMonth(
                    new Date(currentYear, currentMonth)
                );

                for (let j = 0; j <= lastWeekIndex; j++) {
                    cy.getByTestId(`events-list-${j}`).within(() => {
                        cy.contains("Test Event 1");
                    });
                }

                cy.getByTestId("next-month-button").click();
            }
        });

        it("displays leap year events correctly", () => {
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

        it("does not display events from other months", () => {
            cy.contains("Test Event 3").should("not.exist");
            cy.contains("Test Event 4").should("not.exist");

            cy.getByTestId("previous-month-button").click();
            cy.contains("Test Event 1").should("not.exist");
            cy.contains("Test Event 2").should("not.exist");
            cy.contains("Test Event 3");
            cy.contains("Test Event 4").should("not.exist");

            cy.getByTestId("next-month-button").click();
            cy.getByTestId("next-month-button").click();
            cy.contains("Test Event 1").should("not.exist");
            cy.contains("Test Event 2").should("not.exist");
            cy.contains("Test Event 3").should("not.exist");
            cy.contains("Test Event 4");
        });
    });

    describe("Overflow Events", () => {
        const numOfEvents = 7;
        const events = Array.from({ length: numOfEvents }, (_, i) => {
            return createDayEvent(
                `Test Event ${i + 1}`,
                new Date(YEAR, MONTH, DAY),
                i,
                i + 1
            );
        });

        beforeEach(() => {
            cy.visit("/");
            cy.clock(fixedDate.getTime());
            cy.mockDateTimeFormat(LOCALE);

            cy.window().then(win => {
                win.localStorage.setItem("EVENTS", JSON.stringify(events));
            });
        });

        it("displays the overflow button with the correct number of additional events", () => {
            cy.contains("3 další");
        });

        it("opens and closes the overflow popover", () => {
            cy.getByTestId(`overflow-button-${DAY}-${MONTH}`).click();
            cy.getByTestId("popover-content");

            cy.getByTestId("popover-close-button").click();
            cy.getByTestId("popover-content").should("not.exist");
        });

        it("displays events inside the overflow popover", () => {
            cy.getByTestId(`overflow-button-${DAY}-${MONTH}`).click();
            cy.getByTestId("popover-content").within(() => {
                Array.from({ length: numOfEvents }).forEach((_, i) => {
                    cy.contains(`Test Event ${i + 1}`);
                });
            });
        });

        it("displays the correct date in the overflow popover", () => {
            cy.getByTestId(`overflow-button-${DAY}-${MONTH}`).click();
            cy.getByTestId("popover-content").contains(
                fixedDate.toLocaleDateString(LOCALE, {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                })
            );
        });

        it("displays the correct number of additional events when viewport changes", () => {
            cy.contains("3 další");

            cy.viewport(1920, 800);
            cy.contains("5 další");

            cy.viewport(1920, 500);
            cy.contains("7 další");

            cy.viewport(1920, 800);
            cy.contains("5 další");

            cy.viewport(1920, 1080);
            cy.contains("3 další");
        });
    });
});
