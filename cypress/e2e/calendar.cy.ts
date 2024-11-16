/// <reference types="cypress" />

function createBaseEvent(title: string, description = "") {
    return {
        title,
        description,
        id: crypto.randomUUID(),
        color: "pink",
    };
}

function createDayEvent(
    title: string,
    date: Date,
    startTime: number,
    endTime: number,
    description = ""
) {
    return {
        ...createBaseEvent(title, description),
        kind: "DAY_EVENT",
        date: date.toISOString(),
        startTime: new Date(date.setHours(startTime)).toISOString(),
        endTime: new Date(date.setHours(endTime)).toISOString(),
    };
}

function createFullDayEvent(
    title: string,
    from: Date,
    to: Date,
    description = ""
) {
    return {
        ...createBaseEvent(title, description),
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

const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
};

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

    it("displays the names of the week days", () => {
        cy.contains(/sun/i);
        cy.contains(/mon/i);
        cy.contains(/tue/i);
        cy.contains(/wed/i);
        cy.contains(/thu/i);
        cy.contains(/fri/i);
        cy.contains(/sat/i);
    });

    it("displays all the days of the current month in the calendar", () => {
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

    it("highlights the current day in the calendar view", () => {
        const currentDayTestId = `day-${fixedDate.getDate()}-${fixedDate.getMonth()}`;

        cy.getByTestId(currentDayTestId).should("have.class", "bg-blue-500");

        cy.get("[data-testid^='day-']")
            .not(`[data-testid='${currentDayTestId}']`)
            .each($el => {
                cy.wrap($el).should("not.have.class", "bg-blue-500");
            });
    });

    describe("Navigation", () => {
        it("navigates to the next month ", () => {
            cy.getByTestId("next-month-button").click();
            cy.contains(`December ${YEAR}`);
        });

        it("navigates to the previous month", () => {
            cy.getByTestId("previous-month-button").click();
            cy.contains(`October ${YEAR}`);
        });

        it("navigates back to the current month", () => {
            cy.getByTestId("previous-month-button").click();
            cy.getByTestId("previous-month-button").click();
            cy.getByTestId("previous-month-button").click();
            cy.getByTestId("previous-month-button").click();
            cy.getByTestId("today-button").click();
            cy.contains(`November ${YEAR}`);
        });

        it("does not highlight the current day when viewing a different month", () => {
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
        it("displays all the calendar events", () => {
            cy.contains("Test Event 1");
            cy.contains("Test Event 2");
        });

        it("displays full day events correctly in the calendar", () => {
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

        it("displays leap events correctly", () => {
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

        it("displays a preview of the event when an event is clicked", () => {
            const event = createDayEvent(
                "Test Event 1",
                new Date(YEAR, MONTH, 7),
                10,
                11,
                "Test Event Description"
            );

            cy.visit("/");
            cy.clock(fixedDate.getTime());
            cy.mockDateTimeFormat(LOCALE);
            cy.window().then(win => {
                win.localStorage.setItem("EVENTS", JSON.stringify([event]));
            });

            cy.getByTestId(`event-item-${event.id}`).click({ force: true });
            cy.getByTestId("popover-content").within(() => {
                cy.contains(event.title);
                cy.contains(
                    new Date(event.date).toLocaleDateString(LOCALE, {
                        weekday: "long",
                        day: "2-digit",
                        month: "long",
                    })
                );
                cy.contains(
                    `${formatTime(new Date(event.startTime))} - ${formatTime(
                        new Date(event.endTime)
                    )}`
                );
                cy.contains(event.description);
            });
        });

        it("opens and closes the event preview", () => {
            const event = createDayEvent(
                "Test Event 1",
                new Date(YEAR, MONTH, 7),
                10,
                11,
                "Test Event Description"
            );

            cy.visit("/");
            cy.clock(fixedDate.getTime());
            cy.mockDateTimeFormat(LOCALE);
            cy.window().then(win => {
                win.localStorage.setItem("EVENTS", JSON.stringify([event]));
            });

            cy.getByTestId(`event-item-${event.id}`).click({ force: true });
            cy.getByTestId("popover-content");

            cy.getByTestId("popover-close-button").click();
            cy.getByTestId("popover-content").should("not.exist");
        });
    });

    describe("Overflow Events", () => {
        const eventsOf7thDay = Array.from({ length: 5 }, (_, i) =>
            createDayEvent(
                `Test Day Event ${i + 1} for 7th day`,
                new Date(YEAR, MONTH, 7),
                10 + i,
                11 + i
            )
        );

        const events = [
            createFullDayEvent(
                "Test Full Day Event 1",
                new Date(YEAR, MONTH, 5),
                new Date(YEAR, MONTH, 9)
            ),
            createFullDayEvent(
                "Test Full Day Event 2",
                new Date(YEAR, MONTH, 7),
                new Date(YEAR, MONTH, 8)
            ),
            createDayEvent(
                `Test Day Event 1 for 6th day`,
                new Date(YEAR, MONTH, 6),
                10,
                11
            ),
            ...eventsOf7thDay,
            createDayEvent(
                `Test Day Event 1 for 8th day`,
                new Date(YEAR, MONTH, 8),
                10,
                11
            ),
        ];

        beforeEach(() => {
            cy.visit("/");
            cy.clock(fixedDate.getTime());
            cy.mockDateTimeFormat(LOCALE);

            cy.window().then(win => {
                win.localStorage.setItem("EVENTS", JSON.stringify(events));
            });
        });

        it("displays the overflow button with the correct number of additional events", () => {
            cy.getByTestId("overflow-button-7-10").within(() => {
                cy.contains("3 další");
            });
        });

        it("opens and closes the overflow popover", () => {
            cy.getByTestId(`overflow-button-7-10`).click();
            cy.getByTestId("popover-content");

            cy.getByTestId("popover-close-button").click();
            cy.getByTestId("popover-content").should("not.exist");
        });

        it("displays events inside the overflow popover", () => {
            cy.getByTestId(`overflow-button-7-10`).click();
            cy.getByTestId("popover-content").within(() => {
                eventsOf7thDay.forEach((event, index) => {
                    cy.getByTestId(`event-item-${event.id}`).within(() => {
                        expect(event.title).to.equal(
                            `Test Day Event ${index + 1} for 7th day`
                        );
                    });
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

        it("adjusts the number of additional events displayed based on viewport size", () => {
            cy.getByTestId("overflow-button-7-10").within(() => {
                cy.contains("3 další");
            });

            cy.viewport(1920, 800);
            cy.getByTestId("overflow-button-7-10").within(() => {
                cy.contains("5 další");
            });
            cy.getByTestId("overflow-button-8-10").within(() => {
                cy.contains("1 další");
            });

            cy.viewport(1920, 500);
            cy.getByTestId("overflow-button-5-10").within(() => {
                cy.contains("1 další");
            });
            cy.getByTestId("overflow-button-6-10").within(() => {
                cy.contains("2 další");
            });
            cy.getByTestId("overflow-button-7-10").within(() => {
                cy.contains("7 další");
            });
            cy.getByTestId("overflow-button-8-10").within(() => {
                cy.contains("3 další");
            });
            cy.getByTestId("overflow-button-9-10").within(() => {
                cy.contains("1 další");
            });

            cy.viewport(1920, 800);
            cy.getByTestId("overflow-button-5-10").should("not.exist");
            cy.getByTestId("overflow-button-6-10").should("not.exist");
            cy.getByTestId("overflow-button-7-10").within(() => {
                cy.contains("5 další");
            });
            cy.getByTestId("overflow-button-8-10").within(() => {
                cy.contains("1 další");
            });
            cy.getByTestId("overflow-button-9-10").should("not.exist");

            cy.viewport(1920, 1080);
            cy.getByTestId("overflow-button-5-10").should("not.exist");
            cy.getByTestId("overflow-button-6-10").should("not.exist");
            cy.getByTestId("overflow-button-7-10").within(() => {
                cy.contains("3 další");
            });
            cy.getByTestId("overflow-button-8-10").should("not.exist");
            cy.getByTestId("overflow-button-9-10").should("not.exist");
        });
    });

    describe("Event Creation", () => {
        beforeEach(() => {
            cy.visit("/");
            cy.clock(fixedDate.getTime());
            cy.mockDateTimeFormat(LOCALE);

            cy.window().then(win => {
                win.localStorage.clear();
            });
        });

        it("opens and closes the event creation modal", () => {
            cy.getByTestId("day-8-10").click();
            cy.getByTestId("popover-content");

            cy.getByTestId("popover-close-button").click();
            cy.getByTestId("popover-content").should("not.exist");
        });

        it("creates a new day event", () => {
            cy.getByTestId("day-8-10").click();
            cy.getByTestId("popover-content").within(() => {
                cy.getByTestId("title-input").type("Test Day Event");

                cy.getByTestId("start-time-button").click();
                cy.getByTestId("start-time-select").within(() => {
                    cy.get("select").select("10:00", { force: true });
                });

                cy.getByTestId("end-time-button").click();
                cy.getByTestId("end-time-select").within(() => {
                    cy.get("select").select("15:00", { force: true });
                });

                cy.getByTestId("description-input").type(
                    "Test Event Description"
                );

                cy.getByTestId("radio-label-indigo").click();
                cy.getByTestId("save-form-button").click();
            });

            cy.contains("10:00 - Test Day Event");
        });

        it("creates a new full day event", () => {
            cy.getByTestId("day-8-10").click();
            cy.getByTestId("popover-content").within(() => {
                cy.getByTestId("title-input").type("Test Full Day Event");

                cy.getByTestId("full-day-switch").click();
                cy.getByTestId("date-range-button").click();
                cy.get('[data-testid="calendar-range"]', {
                    withinSubject: null,
                }).within(() => {
                    cy.contains("16").click();
                });

                cy.getByTestId("title-input").click();

                cy.getByTestId("radio-label-green").click();
                cy.getByTestId("save-form-button").click();
            });

            cy.contains("Test Full Day Event");
        });

        it("saves the created event in localStorage", () => {
            cy.getByTestId("day-8-10").click();
            cy.getByTestId("popover-content").within(() => {
                cy.getByTestId("title-input").type("Test Event");
                cy.getByTestId("save-form-button").click();
            });

            cy.window().then(win => {
                const storedEvents = JSON.parse(
                    win.localStorage.getItem("EVENTS") || "[]"
                );
                const createdEvent = storedEvents.find(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (e: any) => e.title === "Test Event"
                );
                // eslint-disable-next-line
                expect(createdEvent).to.exist;
            });
        });

        it("displays the overflow button when too many events are created", () => {
            for (let i = 0; i < 5; i++) {
                cy.getByTestId("day-8-10").click();
                cy.getByTestId("popover-content").within(() => {
                    cy.getByTestId("title-input").type("a");
                    cy.getByTestId("save-form-button").click();
                });

                if (i < 4) {
                    cy.getByTestId("overflow-button-8-10").should("not.exist");
                } else {
                    cy.getByTestId("overflow-button-8-10").within(() => {
                        cy.contains("1 další");
                    });
                }
            }

            cy.getByTestId("day-8-10").click();
            cy.getByTestId("popover-content").within(() => {
                cy.getByTestId("title-input").type("a");
                cy.getByTestId("save-form-button").click();
            });

            cy.getByTestId("overflow-button-8-10").within(() => {
                cy.contains("2 další");
            });
        });

        it("does not create an event when the form is submitted empty", () => {
            cy.getByTestId("day-8-10").click();
            cy.getByTestId("popover-content").within(() => {
                cy.getByTestId("save-form-button").click();
            });

            cy.contains("String must contain at least 1 character(s)");
        });

        it("creates and updates a draft event with correct values", () => {
            cy.getByTestId("day-8-10").click();

            cy.getByTestId("draft-event-item").should("exist");
            cy.getByTestId("draft-event-item").contains("(bez názvu)");

            cy.getByTestId("popover-content").within(() => {
                cy.getByTestId("title-input").type("Test Draft Event");
            });

            cy.getByTestId("draft-event-item").contains(
                "00:00 - Test Draft Event"
            );

            cy.getByTestId("popover-content").within(() => {
                cy.getByTestId("start-time-button").click();
                cy.getByTestId("start-time-select").within(() => {
                    cy.get("select").select("10:00", { force: true });
                });
            });

            cy.getByTestId("draft-event-item").contains(
                "10:00 - Test Draft Event"
            );

            cy.getByTestId("popover-content").within(() => {
                cy.getByTestId("full-day-switch").click();
            });

            cy.getByTestId("draft-event-item").contains("Test Draft Event");

            cy.getByTestId("popover-content").within(() => {
                cy.getByTestId("date-range-button").click();
                cy.get('[data-testid="calendar-range"]', {
                    withinSubject: null,
                }).within(() => {
                    cy.contains("16").click();
                });
            });

            cy.getByTestId("events-list-1").within(() => {
                cy.getByTestId("draft-event-item").contains("Test Draft Event");
            });

            cy.getByTestId("events-list-2").within(() => {
                cy.getByTestId("draft-event-item").contains("Test Draft Event");
            });

            cy.getByTestId("popover-content").within(() => {
                cy.getByTestId("date-range-button").click();
                cy.get('[data-testid="calendar-range"]', {
                    withinSubject: null,
                }).within(() => {
                    cy.contains("19").click();
                });
            });

            cy.getByTestId("events-list-1").within(() => {
                cy.getByTestId("draft-event-item").contains("Test Draft Event");
            });

            cy.getByTestId("events-list-2").within(() => {
                cy.getByTestId("draft-event-item").contains("Test Draft Event");
            });

            cy.getByTestId("events-list-3").within(() => {
                cy.getByTestId("draft-event-item").contains("Test Draft Event");
            });

            cy.getByTestId("popover-content").within(() => {
                cy.getByTestId("full-day-switch").click();
            });

            cy.getByTestId("events-list-2").within(() => {
                cy.getByTestId("draft-event-item").should("not.exist");
            });

            cy.getByTestId("events-list-3").within(() => {
                cy.getByTestId("draft-event-item").should("not.exist");
            });

            cy.getByTestId("draft-event-item").contains(
                "10:00 - Test Draft Event"
            );
        });

        it("removes the draft event when closing the event creation modal", () => {
            cy.getByTestId("day-8-10").click();
            cy.getByTestId("draft-event-item").should("exist");

            cy.getByTestId("popover-close-button").click();
            cy.getByTestId("draft-event-item").should("not.exist");
        });

        it("removes the draft event when submitting the event creation form", () => {
            cy.getByTestId("day-8-10").click();
            cy.getByTestId("draft-event-item").should("exist");

            cy.getByTestId("popover-content").within(() => {
                cy.getByTestId("title-input").type("Test Draft Event");
                cy.getByTestId("save-form-button").click();
            });

            cy.getByTestId("draft-event-item").should("not.exist");
        });
    });

    describe("Event Update", () => {
        const event1 = createDayEvent(
            "Test Event 1",
            new Date(YEAR, MONTH, 7),
            10,
            11
        );

        const event2 = createFullDayEvent(
            "Test Event 2",
            new Date(YEAR, MONTH, 5),
            new Date(YEAR, MONTH, 6)
        );

        beforeEach(() => {
            cy.visit("/");
            cy.clock(fixedDate.getTime());
            cy.mockDateTimeFormat(LOCALE);

            const events = [event1, event2];

            cy.window().then(win => {
                win.localStorage.setItem("EVENTS", JSON.stringify(events));
            });
        });

        it("opens and closes the event update modal", () => {
            cy.getByTestId(`event-item-${event1.id}`).click({ force: true });
            cy.getByTestId("edit-event-button").click();

            cy.getByTestId("popover-content");

            cy.getByTestId("popover-close-button").click();
            cy.getByTestId("popover-content").should("not.exist");
        });

        it("updates the event title", () => {
            cy.getByTestId(`event-item-${event1.id}`).click({ force: true });
            cy.getByTestId("edit-event-button").click();

            cy.getByTestId("popover-content").within(() => {
                cy.getByTestId("title-input").clear().type("Updated Event");
                cy.getByTestId("save-form-button").click();
            });

            cy.getByTestId(`event-item-${event1.id}`).within(() => {
                cy.contains("Updated Event");
            });
        });

        it("updates the event start time", () => {
            cy.getByTestId(`event-item-${event1.id}`).click({ force: true });
            cy.getByTestId("edit-event-button").click();

            cy.getByTestId("popover-content").within(() => {
                cy.getByTestId("start-time-button").click();
                cy.getByTestId("start-time-select").within(() => {
                    cy.get("select").select("12:00", { force: true });
                });

                cy.getByTestId("save-form-button").click();
            });

            cy.getByTestId(`event-item-${event1.id}`).within(() => {
                cy.contains("12:00 - Test Event 1");
            });
        });

        it("updates a day event to a full day event", () => {
            cy.getByTestId(`event-item-${event1.id}`).click({ force: true });
            cy.getByTestId("edit-event-button").click();

            cy.getByTestId("popover-content").within(() => {
                cy.getByTestId("full-day-switch").click();
                cy.getByTestId("date-range-button").click();
                cy.getByTestId("title-input").click();
                cy.getByTestId("save-form-button").click();
            });

            cy.getByTestId(`event-item-${event1.id}`).within(() => {
                cy.contains("Test Event 1");
                cy.get('[data-kind="full-day-event"]').should("exist");
            });
        });

        it("updates a full day event to a day event", () => {
            cy.getByTestId(`event-item-${event2.id}`).click({
                force: true,
            });
            cy.getByTestId("edit-event-button").click();

            cy.getByTestId("popover-content").within(() => {
                cy.getByTestId("full-day-switch").click();
                cy.getByTestId("start-time-button").click();
                cy.getByTestId("start-time-select").within(() => {
                    cy.get("select").select("10:00", { force: true });
                });

                cy.getByTestId("end-time-button").click();
                cy.getByTestId("end-time-select").within(() => {
                    cy.get("select").select("15:00", { force: true });
                });

                cy.getByTestId("save-form-button").click();
            });

            cy.getByTestId(`event-item-${event2.id}`).within(() => {
                cy.contains("10:00 - Test Event 2");
                cy.get('[data-kind="day-event"]').should("exist");
            });
        });

        it("saves the updated event in localStorage", () => {
            cy.getByTestId(`event-item-${event1.id}`).click({ force: true });
            cy.getByTestId("edit-event-button").click();

            cy.getByTestId("popover-content").within(() => {
                cy.getByTestId("title-input").clear().type("Updated Event");
                cy.getByTestId("save-form-button").click();
            });

            cy.window().then(win => {
                const storedEvents = JSON.parse(
                    win.localStorage.getItem("EVENTS") || "[]"
                );
                const updatedEvent = storedEvents.find(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (e: any) => e.id === event1.id
                );
                expect(updatedEvent.title).to.equal("Updated Event");
            });
        });
    });

    describe("Event Removal", () => {
        const event = createDayEvent(
            "Test Event 1",
            new Date(YEAR, MONTH, 7),
            10,
            11
        );

        beforeEach(() => {
            cy.visit("/");
            cy.clock(fixedDate.getTime());
            cy.mockDateTimeFormat(LOCALE);

            const events = [event];

            cy.window().then(win => {
                win.localStorage.setItem("EVENTS", JSON.stringify(events));
            });
        });

        it("removes the event from the calendar", () => {
            cy.getByTestId(`event-item-${event.id}`).click({ force: true });
            cy.getByTestId("remove-event-button").click();

            cy.getByTestId(`event-item-${event.id}`).should("not.exist");
        });

        it("removes the event from localStorage", () => {
            cy.getByTestId(`event-item-${event.id}`).click({ force: true });
            cy.getByTestId("remove-event-button").click();

            cy.window().then(win => {
                const storedEvents = JSON.parse(
                    win.localStorage.getItem("EVENTS") || "[]"
                );
                expect(storedEvents).to.have.length(0);
            });
        });

        it("recalculates the overflow amount correctly when an event is removed", () => {
            const numOfEvents = 7;
            const events = Array.from({ length: numOfEvents }, (_, i) => {
                return createDayEvent(
                    `Test Event ${i + 1}`,
                    new Date(YEAR, MONTH, DAY),
                    i,
                    i + 1
                );
            });

            cy.window().then(win => {
                win.localStorage.setItem("EVENTS", JSON.stringify(events));
            });

            cy.visit("/");

            cy.getByTestId("overflow-button-7-10").within(() => {
                cy.contains("3 další");
            });

            cy.getByTestId(`event-item-${events[0].id}`).click({ force: true });
            cy.getByTestId("remove-event-button").click();
            cy.getByTestId("overflow-button-7-10").within(() => {
                cy.contains("2 další");
            });

            cy.getByTestId(`event-item-${events[1].id}`).click({ force: true });
            cy.getByTestId("remove-event-button").click();
            cy.getByTestId("overflow-button-7-10").within(() => {
                cy.contains("1 další");
            });

            cy.getByTestId(`event-item-${events[2].id}`).click({ force: true });
            cy.getByTestId("remove-event-button").click();
            cy.getByTestId("overflow-button-7-10").should("not.exist");
        });
    });
});
