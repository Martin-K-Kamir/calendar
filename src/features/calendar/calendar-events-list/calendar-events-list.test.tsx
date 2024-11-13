import { render, screen } from "@testing-library/react";
import {
    describe,
    it,
    expect,
    vi,
    beforeEach,
    afterAll,
    type Mock,
} from "vitest";
import { YEAR, MONTH } from "@/testing/constants";
import {
    useEvents,
    EVENT_COLORS,
    DAY_EVENT,
    CalendarEventsList,
    type CalendarEventCell,
} from "@/features/calendar";

vi.mock("@/features/calendar/hooks/use-events", () => ({
    useEvents: vi.fn(),
}));

const mockEvents: CalendarEventCell[] = [
    {
        colStart: 1,
        colEnd: 2,
        event: {
            kind: DAY_EVENT,
            id: crypto.randomUUID(),
            title: "Test Event 1",
            date: new Date(YEAR, MONTH, 4), // 4th Nov 2024
            startTime: new Date(YEAR, MONTH, 4, 10, 0), // 10:00
            endTime: new Date(YEAR, MONTH, 4, 11, 0), // 11:00
            description: "Test Description",
            color: EVENT_COLORS[0],
        },
    },
    {
        colStart: 1,
        colEnd: 2,
        event: {
            kind: DAY_EVENT,
            id: crypto.randomUUID(),
            title: "Test Event 2",
            date: new Date(YEAR, MONTH, 4), // 4th Nov 2024
            startTime: new Date(YEAR, MONTH, 4, 11, 0), // 11:00
            endTime: new Date(YEAR, MONTH, 4, 12, 0), // 12:00
            description: "Test Description",
            color: EVENT_COLORS[0],
        },
    },
    {
        colStart: 1,
        colEnd: 2,
        event: {
            kind: DAY_EVENT,
            id: crypto.randomUUID(),
            title: "Test Event 3",
            date: new Date(YEAR, MONTH, 4), // 4th Nov 2024
            startTime: new Date(YEAR, MONTH, 4, 12, 0), // 12:00
            endTime: new Date(YEAR, MONTH, 4, 13, 0), // 13:00
            description: "Test Description",
            color: EVENT_COLORS[0],
        },
    },
    {
        colStart: 1,
        colEnd: 2,
        event: {
            kind: DAY_EVENT,
            id: crypto.randomUUID(),
            title: "Test Event 4",
            date: new Date(YEAR, MONTH, 4), // 4th Nov 2024
            startTime: new Date(YEAR, MONTH, 4, 13, 0), // 13:00
            endTime: new Date(YEAR, MONTH, 4, 14, 0), // 14:00
            description: "Test Description",
            color: EVENT_COLORS[0],
        },
    },
];

const mockDaysOfWeek = Array.from(
    { length: 7 },
    (_, i) => new Date(YEAR, MONTH, i + 4)
);

const mockDraftEvent: CalendarEventCell = {
    event: {
        kind: DAY_EVENT,
        id: crypto.randomUUID(),
        title: "Test Draft Event",
        date: new Date(YEAR, MONTH, 4), // 4th Nov 2024
        startTime: new Date(YEAR, MONTH, 4, 13, 0), // 13:00
        endTime: new Date(YEAR, MONTH, 4, 14, 0), // 14:00
        description: "Test Description",
        color: EVENT_COLORS[0],
    },
    colStart: 1,
    colEnd: 2,
};

describe("CalendarEventsList Component", () => {
    beforeEach(() => {
        (useEvents as Mock).mockReturnValue({
            addDraftEvent: vi.fn(),
            removeDraftEvent: vi.fn(),
            updateEvent: vi.fn(),
            removeEvent: vi.fn(),
        });
    });

    afterAll(() => {
        vi.restoreAllMocks();
    });

    it("renders events correctly", () => {
        render(
            <CalendarEventsList
                events={mockEvents}
                daysOfWeek={mockDaysOfWeek}
                draftEvent={null}
            />
        );

        mockEvents.forEach(event => {
            expect(screen.getByText(event.event.title)).toBeDefined();
        });
    });

    it("renders draft event correctly", () => {
        render(
            <CalendarEventsList
                events={mockEvents}
                daysOfWeek={mockDaysOfWeek}
                draftEvent={mockDraftEvent}
            />
        );

        expect(screen.getByText("Test Draft Event")).toBeDefined();
    });

    it("handles overflow events correctly", () => {
        const observe = vi.fn();
        const disconnect = vi.fn();
        const unobserve = vi.fn();

        window.ResizeObserver = vi.fn(() => ({
            observe,
            disconnect,
            unobserve,
        }));

        render(
            <CalendarEventsList
                events={mockEvents}
                daysOfWeek={mockDaysOfWeek}
                draftEvent={null}
            />
        );

        const containerElement =
            screen.getByText("Test Event 1").parentElement?.parentElement;
        if (containerElement) {
            const resizeObserverCallback = (window.ResizeObserver as any).mock
                .calls[0][0];
            resizeObserverCallback([{ target: containerElement }]);
        }

        expect(observe).toHaveBeenCalled();
    });
});
