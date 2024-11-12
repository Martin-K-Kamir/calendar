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
import * as lib from "@/lib";
import { YEAR, MONTH } from "@/testConstants";
import { useEvents } from "@/hooks/use-events";
import { EVENT_COLORS, DAY_EVENT } from "@/providers/events-provider";
import { type CalendarEventCell, useCalendar } from "./hooks";
import { Calendar } from "./calendar";

vi.mock("@/lib", async () => {
    const originalModule = await vi.importActual<typeof lib>("@/lib");
    return {
        ...originalModule,
        formatDate: vi.fn(),
    };
});

vi.mock("./hooks");
vi.mock("@/hooks/use-events");

const mockDate = new Date(YEAR, MONTH, 1); // 1st Nov 2024

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

const mockUseCalendar = {
    selectedMonth: mockDate,
    calendarDays: [
        new Date(YEAR, MONTH, 1),
        new Date(YEAR, MONTH, 2),
        new Date(YEAR, MONTH, 3),
        new Date(YEAR, MONTH, 4),
    ],
    calendarWeeksWithDays: [],
    calendarEvents: [mockEvents],
    calendarDraftEvent: [mockDraftEvent],
    handleNextMonth: vi.fn(),
    handlePreviousMonth: vi.fn(),
    handleToday: vi.fn(),
};

describe("Calendar Component", () => {
    beforeEach(() => {
        (lib.formatDate as Mock).mockImplementation((date, options) => {
            return new Intl.DateTimeFormat("en-US", options).format(date);
        });

        (useCalendar as Mock).mockReturnValue(mockUseCalendar);
        (useEvents as Mock).mockReturnValue({
            addEvent: vi.fn(),
            addDraftEvent: vi.fn(),
            removeEvent: vi.fn(),
            removeDraftEvent: vi.fn(),
        });
    });

    afterAll(() => {
        vi.restoreAllMocks();
    });

    it("renders current month and year", () => {
        render(<Calendar />);
        expect(screen.getByText("November 2024")).toBeDefined();
    });

    it("renders week days", () => {
        render(<Calendar />);

        expect(screen.getByText(/sun/i)).toBeDefined();
        expect(screen.getByText(/mon/i)).toBeDefined();
        expect(screen.getByText(/tue/i)).toBeDefined();
        expect(screen.getByText(/wed/i)).toBeDefined();
        expect(screen.getByText(/thu/i)).toBeDefined();
        expect(screen.getByText(/fri/i)).toBeDefined();
        expect(screen.getByText(/sat/i)).toBeDefined();
    });

    it("renders calendar days", () => {
        render(<Calendar />);

        mockUseCalendar.calendarDays.forEach(day => {
            if (day.getDate() === 1) {
                expect(screen.getByText(/1. Nov/i)).toBeDefined();
            } else {
                expect(
                    screen.getByText(day.getDate().toString())
                ).toBeDefined();
            }
        });
    });

    it("renders calendar events", () => {
        render(<Calendar />);

        mockUseCalendar.calendarEvents.forEach(event => {
            event.forEach(e => {
                expect(screen.getByText(e.event.title)).toBeDefined();
            });
        });
    });

    it("renders draft event", () => {
        render(<Calendar />);

        expect(screen.getByText("Test Draft Event")).toBeDefined();
    });
});
