import { useContext } from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import {
    EventsProvider,
    EventsProviderContext,
    Event,
    EVENT_COLORS,
} from "@/features/calendar";

describe("EventsProvider", () => {
    const TestComponent = () => {
        const context = useContext(EventsProviderContext);

        if (!context) {
            return;
        }

        const {
            events,
            draftEvent,
            addEvent,
            addDraftEvent,
            removeEvent,
            removeDraftEvent,
            updateEvent,
        } = context;

        return (
            <div>
                <span data-testid="events">{JSON.stringify(events)}</span>
                <span data-testid="draft-event">
                    {JSON.stringify(draftEvent)}
                </span>
                <button
                    onClick={() =>
                        addEvent({
                            title: "Test Event",
                            description: "Test Description",
                            color: EVENT_COLORS[0],
                            kind: "FULL_DAY_EVENT",
                            from: new Date(),
                            to: new Date(),
                        })
                    }
                >
                    Add Event
                </button>
                <button
                    onClick={() =>
                        addDraftEvent({
                            title: "Draft Event",
                            description: "Draft Description",
                            color: EVENT_COLORS[1],
                            kind: "DAY_EVENT",
                            startTime: new Date(),
                            endTime: new Date(),
                            date: new Date(),
                        })
                    }
                >
                    Add Draft Event
                </button>
                <button onClick={() => removeDraftEvent()}>
                    Remove Draft Event
                </button>
                <button
                    onClick={() => {
                        if (events.length > 0) {
                            updateEvent({
                                ...events[0],
                                title: "Updated Event",
                            });
                        }
                    }}
                >
                    Update Event
                </button>
                <button
                    onClick={() => {
                        if (events.length > 0) {
                            removeEvent(events[0].id);
                        }
                    }}
                >
                    Remove Event
                </button>
            </div>
        );
    };

    beforeEach(() => {
        localStorage.clear();
    });

    it("should load events from localStorage", () => {
        const storedEvents: Event[] = [
            {
                id: crypto.randomUUID(),
                title: "Stored Event",
                description: "Stored Description",
                color: "pink",
                kind: "FULL_DAY_EVENT",
                from: new Date(),
                to: new Date(),
            },
        ];
        localStorage.setItem("EVENTS", JSON.stringify(storedEvents));

        render(
            <EventsProvider>
                <TestComponent />
            </EventsProvider>
        );

        expect(screen.getByTestId("events").textContent).toBe(
            JSON.stringify(storedEvents)
        );
    });

    it("should add a new event", () => {
        render(
            <EventsProvider>
                <TestComponent />
            </EventsProvider>
        );

        act(() => {
            screen.getByText("Add Event").click();
        });

        const events = JSON.parse(
            screen.getByTestId("events").textContent || "[]"
        );
        expect(events.length).toBe(1);
        expect(events[0].title).toBe("Test Event");
    });

    it("should add a draft event", () => {
        render(
            <EventsProvider>
                <TestComponent />
            </EventsProvider>
        );

        act(() => {
            screen.getByText("Add Draft Event").click();
        });

        const draftEvent = JSON.parse(
            screen.getByTestId("draft-event").textContent || "{}"
        );
        expect(draftEvent.title).toBe("Draft Event");
    });

    it("should remove a draft event", () => {
        render(
            <EventsProvider>
                <TestComponent />
            </EventsProvider>
        );

        act(() => {
            screen.getByText("Add Draft Event").click();
        });

        act(() => {
            screen.getByText("Remove Draft Event").click();
        });

        const draftEvent = screen.getByTestId("draft-event").textContent;
        expect(draftEvent).toBe("null");
    });

    it("should save events to localStorage", () => {
        render(
            <EventsProvider>
                <TestComponent />
            </EventsProvider>
        );

        act(() => {
            screen.getByText("Add Event").click();
        });

        const storedEvents = JSON.parse(localStorage.getItem("EVENTS") || "[]");
        expect(storedEvents.length).toBe(1);
        expect(storedEvents[0].title).toBe("Test Event");
    });

    it("should update an event", () => {
        render(
            <EventsProvider>
                <TestComponent />
            </EventsProvider>
        );

        act(() => {
            screen.getByText("Add Event").click();
        });

        act(() => {
            screen.getByText("Update Event").click();
        });

        const events = JSON.parse(
            screen.getByTestId("events").textContent || "[]"
        );
        expect(events[0].title).toBe("Updated Event");
    });

    it("should remove an event", () => {
        render(
            <EventsProvider>
                <TestComponent />
            </EventsProvider>
        );

        act(() => {
            screen.getByText("Add Event").click();
        });

        act(() => {
            screen.getByText("Remove Event").click();
        });

        const events = JSON.parse(
            screen.getByTestId("events").textContent || "[]"
        );
        expect(events.length).toBe(0);
    });
});
