import { renderHook, act } from "@testing-library/react";
import {
    vi,
    describe,
    it,
    expect,
    beforeEach,
    afterAll,
    type Mock,
} from "vitest";
import { useSettings } from "@/hooks/use-settings";
import { type UnionOmit } from "@/types";
import { YEAR, MONTH } from "@/testing/constants";
import {
    useCalendar,
    useEvents,
    EVENT_COLORS,
    DAY_EVENT,
    FULL_DAY_EVENT,
    type Event,
} from "@/features/calendar";

vi.mock("@/hooks/use-settings");
vi.mock("@/features/calendar/hooks/use-events");

const FIRST_WEEK = 0;
const SECOND_WEEK = 1;
const THIRD_WEEK = 2;
const FIFTH_WEEK = 4;
const LAST_WEEK = -1;

const checkEventOrder = (
    expectedFirstEvent: UnionOmit<Event, "description">,
    expectedSecondEvent: UnionOmit<Event, "description">
) => {
    const { result } = renderHook(() => useCalendar());
    const { calendarEvents } = result.current;

    const firstEvent = calendarEvents[FIFTH_WEEK][0];
    const secondEvent = calendarEvents[FIFTH_WEEK][1];

    expect(firstEvent.event.id).toBe(expectedFirstEvent.id);
    expect(secondEvent.event.id).toBe(expectedSecondEvent.id);
};

const mockEvents = [
    {
        kind: DAY_EVENT,
        date: new Date(YEAR, MONTH, 5), // 5th Nov 2024
        startTime: new Date(YEAR, MONTH, 5, 10, 0), // 10:00
        endTime: new Date(YEAR, MONTH, 5, 12, 0), // 12:00
        id: crypto.randomUUID(),
        title: "Test Event 1",
        color: EVENT_COLORS[0],
    },
    {
        kind: FULL_DAY_EVENT,
        from: new Date(YEAR, MONTH, 4), // 4th Nov 2024
        to: new Date(YEAR, MONTH, 6), // 6th Nov 2024
        id: crypto.randomUUID(),
        title: "Test Event 2",
        color: EVENT_COLORS[4],
    },
    {
        kind: FULL_DAY_EVENT,
        from: new Date(YEAR, MONTH, 2), // 2nd Nov 2024
        to: new Date(YEAR, MONTH, 9), // 9th Nov 2024
        id: crypto.randomUUID(),
        title: "Test Event 3",
        color: EVENT_COLORS[2],
    },
];

const mockDraftEvent = {
    kind: DAY_EVENT,
    date: new Date(YEAR, MONTH, 7), // 7th Nov 2024
    startTime: new Date(YEAR, MONTH, 7, 11, 15), // 11:15
    endTime: new Date(YEAR, MONTH, 7, 12, 15), // 12:15
    id: crypto.randomUUID(),
    title: "Draft Event",
    color: EVENT_COLORS[1],
};

describe("useCalendar hook", () => {
    beforeEach(() => {
        (useSettings as Mock).mockReturnValue({
            weekStartDay: 1,
        });
        (useEvents as Mock).mockReturnValue({
            events: mockEvents,
            draftEvent: mockDraftEvent,
        });
        vi.setSystemTime(new Date(YEAR, MONTH, 5));
    });

    afterAll(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    it("should initialize selectedMonth to the current date", () => {
        const { result } = renderHook(() => useCalendar());
        const { selectedMonth } = result.current;

        const today = new Date();

        expect(selectedMonth.getMonth()).toBe(today.getMonth());
        expect(selectedMonth.getFullYear()).toBe(today.getFullYear());
    });

    it("should handle next month navigation", () => {
        const { result } = renderHook(() => useCalendar());
        const { selectedMonth, handleNextMonth } = result.current;

        const initialMonth = selectedMonth;
        act(() => handleNextMonth());

        expect(result.current.selectedMonth).not.toEqual(initialMonth);
        expect(result.current.selectedMonth.getMonth()).toBe(
            initialMonth.getMonth() + 1
        );
    });

    it("should handle previous month navigation", () => {
        const { result } = renderHook(() => useCalendar());
        const { selectedMonth, handlePreviousMonth } = result.current;

        const initialMonth = selectedMonth;
        act(() => handlePreviousMonth());

        expect(result.current.selectedMonth).not.toEqual(initialMonth);
        expect(result.current.selectedMonth.getMonth()).toBe(
            initialMonth.getMonth() - 1
        );
    });

    it("should handle today button click", () => {
        const { result } = renderHook(() => useCalendar());
        const { handleToday, selectedMonth } = result.current;

        act(() => handleToday());

        expect(selectedMonth.getDate()).toBe(new Date().getDate());
    });

    it("should correctly categorize events into weeks", () => {
        const { result } = renderHook(() => useCalendar());
        const { calendarEvents } = result.current;

        expect(calendarEvents).toBeDefined();
        expect(calendarEvents.length).toBeGreaterThanOrEqual(5);
        expect(calendarEvents.length).toBeLessThanOrEqual(6);
        expect(calendarEvents[SECOND_WEEK].length).toBe(mockEvents.length);
    });

    it("should correctly calculate calendarWeeksWithDays", () => {
        const { result } = renderHook(() => useCalendar());
        const { calendarWeeksWithDays } = result.current;

        expect(calendarWeeksWithDays).toBeDefined();
        expect(calendarWeeksWithDays.length).toBeGreaterThan(1);

        calendarWeeksWithDays.forEach(week => {
            expect(week.length).toBe(7);
            week.forEach(day => {
                expect(day).toBeInstanceOf(Date);
            });
        });

        const firstWeek = calendarWeeksWithDays[FIRST_WEEK];
        const lastWeek = calendarWeeksWithDays.at(LAST_WEEK);

        expect(firstWeek[0].getDay()).toBe(1);
        expect(lastWeek?.[6].getDay()).toBe(0);
    });

    it("should include events spanning multiple months when navigating to the next month", () => {
        const notSpanningEvent = {
            kind: FULL_DAY_EVENT,
            from: new Date(YEAR, MONTH, 5), // 5th Nov 2024
            to: new Date(YEAR, MONTH, 11), // 11th Nov 2024
            id: crypto.randomUUID(),
            title: "Test Event 1",
            color: EVENT_COLORS[0],
        };

        const spanningEvent = {
            kind: FULL_DAY_EVENT,
            from: new Date(YEAR, MONTH, 11), // 11th Nov 2024
            to: new Date(YEAR, MONTH, 25), // 25th Nov 2024
            id: crypto.randomUUID(),
            title: "Test Event 2",
            color: EVENT_COLORS[0],
        };

        (useEvents as Mock).mockReturnValue({
            events: [notSpanningEvent, spanningEvent],
        });

        const { result } = renderHook(() => useCalendar());
        const { handleNextMonth } = result.current;

        act(() => handleNextMonth());

        const { calendarEvents } = result.current;
        const firstEventInFirstWeek = calendarEvents[FIRST_WEEK][0];

        expect(firstEventInFirstWeek.event.id).toBe(spanningEvent.id);
    });

    it("should include events spanning multiple months when navigating to the previous month", () => {
        const notSpanningEvent = {
            kind: FULL_DAY_EVENT,
            from: new Date(YEAR, MONTH, 25), // 25th Nov 2024
            to: new Date(YEAR, MONTH, 30), // 30th Nov 2024
            id: crypto.randomUUID(),
            title: "Test Event 1",
            color: EVENT_COLORS[0],
        };

        const spanningEvent = {
            kind: FULL_DAY_EVENT,
            from: new Date(YEAR, MONTH, 1), // 10th Nov 2024
            to: new Date(YEAR, MONTH, 25), // 25th Nov 2024
            id: crypto.randomUUID(),
            title: "Test Event 2",
            color: EVENT_COLORS[0],
        };

        (useEvents as Mock).mockReturnValue({
            events: [notSpanningEvent, spanningEvent],
        });

        const { result } = renderHook(() => useCalendar());
        const { handlePreviousMonth } = result.current;

        act(() => handlePreviousMonth());

        const { calendarEvents } = result.current;
        const firstEventInLastWeek = calendarEvents.at(LAST_WEEK)?.at(0);

        expect(firstEventInLastWeek?.event.id).toBe(spanningEvent.id);
    });

    describe("Calendar calculations when the week starts on Monday", () => {
        beforeEach(() => {
            (useSettings as Mock).mockReturnValue({
                weekStartDay: 1,
            });
        });

        it("should correctly compute calendarDays", () => {
            const { result } = renderHook(() => useCalendar());
            const { calendarDays } = result.current;

            expect(calendarDays).toBeDefined();
            expect(calendarDays.length).toBeGreaterThan(1);

            calendarDays.forEach(day => {
                expect(day).toBeInstanceOf(Date);
            });

            const firstDay = calendarDays.at(0);
            const lastDay = calendarDays.at(-1);
            expect(firstDay?.getDate()).toBe(28);
            expect(lastDay?.getDate()).toBe(1);
        });

        it("should correctly calculate event's position in the calendar", () => {
            const { result } = renderHook(() => useCalendar());
            const { calendarEvents } = result.current;

            const firstEventInFirstWeek = calendarEvents[FIRST_WEEK][0];
            const firstEventInSecondWeeek = calendarEvents[SECOND_WEEK][0];
            const secondEventInSecondWeeek = calendarEvents[SECOND_WEEK][1];
            const thirdEventInSecondWeeek = calendarEvents[SECOND_WEEK][2];

            expect(firstEventInFirstWeek.colStart).toBe(6);
            expect(firstEventInFirstWeek.colEnd).toBe(8);

            expect(firstEventInSecondWeeek.colStart).toBe(1);
            expect(firstEventInSecondWeeek.colEnd).toBe(7);
            expect(firstEventInSecondWeeek.event.id).toBe(
                firstEventInFirstWeek.event.id
            );

            expect(secondEventInSecondWeeek.colStart).toBe(1);
            expect(secondEventInSecondWeeek.colEnd).toBe(4);

            expect(thirdEventInSecondWeeek.colStart).toBe(2);
            expect(thirdEventInSecondWeeek.colEnd).toBe(3);
        });

        it("should correctly calculate DAY_EVENT draft event position in the calendar", () => {
            const { result } = renderHook(() => useCalendar());
            const { calendarDraftEvent } = result.current;

            expect(calendarDraftEvent?.[FIFTH_WEEK]).toBeNull();
            expect(calendarDraftEvent?.[THIRD_WEEK]).toBeNull();

            const draftEvent = calendarDraftEvent?.[SECOND_WEEK];
            expect(draftEvent?.colStart).toBe(4);
            expect(draftEvent?.colEnd).toBe(5);
        });

        it("should correctly calculate FULL_DAY_EVENT draft event position in the calendar", () => {
            (useEvents as Mock).mockReturnValue({
                events: mockEvents,
                draftEvent: {
                    kind: FULL_DAY_EVENT,
                    from: new Date(YEAR, MONTH, 1),
                    to: new Date(YEAR, MONTH, 9),
                    id: crypto.randomUUID(),
                    title: "Draft Event",
                    color: EVENT_COLORS[0],
                },
            });

            const { result } = renderHook(() => useCalendar());
            const { calendarDraftEvent } = result.current;

            const inFirstWeekDraftEvent = calendarDraftEvent?.[FIRST_WEEK];
            const inSecondWeekDraftEvent = calendarDraftEvent?.[SECOND_WEEK];

            expect(inFirstWeekDraftEvent?.colStart).toBe(5);
            expect(inFirstWeekDraftEvent?.colEnd).toBe(8);

            expect(inSecondWeekDraftEvent?.colStart).toBe(1);
            expect(inSecondWeekDraftEvent?.colEnd).toBe(7);
        });
    });

    describe("Calendar calculations when the week starts on Sunday", () => {
        beforeEach(() => {
            (useSettings as Mock).mockReturnValue({
                weekStartDay: 0,
            });
        });

        it("should correctly compute calendarDays", () => {
            const { result } = renderHook(() => useCalendar());
            const { calendarDays } = result.current;

            expect(calendarDays).toBeDefined();
            expect(calendarDays.length).toBeGreaterThan(1);

            calendarDays.forEach(day => {
                expect(day).toBeInstanceOf(Date);
            });

            const firstDay = calendarDays.at(0);
            const lastDay = calendarDays.at(-1);
            expect(firstDay?.getDate()).toBe(27);
            expect(lastDay?.getDate()).toBe(30);
        });

        it("should correctly calculate event's position in the calendar", () => {
            const { result } = renderHook(() => useCalendar());
            const { calendarEvents } = result.current;

            const firstEventInFirstWeek = calendarEvents[FIRST_WEEK][0];
            const firstEventInSecondWeeek = calendarEvents[SECOND_WEEK][0];
            const secondEventInSecondWeeek = calendarEvents[SECOND_WEEK][1];
            const thirdEventInSecondWeeek = calendarEvents[SECOND_WEEK][2];

            expect(firstEventInFirstWeek.colStart).toBe(7);
            expect(firstEventInFirstWeek.colEnd).toBe(8);

            expect(firstEventInSecondWeeek.colStart).toBe(1);
            expect(firstEventInSecondWeeek.colEnd).toBe(8);
            expect(firstEventInSecondWeeek.event.id).toBe(
                firstEventInFirstWeek.event.id
            );

            expect(secondEventInSecondWeeek.colStart).toBe(2);
            expect(secondEventInSecondWeeek.colEnd).toBe(5);

            expect(thirdEventInSecondWeeek.colStart).toBe(3);
            expect(thirdEventInSecondWeeek.colEnd).toBe(4);
        });

        it("should correctly calculate DAY_EVENT draft event position in the calendar", () => {
            const { result } = renderHook(() => useCalendar());
            const { calendarDraftEvent } = result.current;

            const draftEvent = calendarDraftEvent?.[SECOND_WEEK];
            expect(draftEvent?.colStart).toBe(5);
            expect(draftEvent?.colEnd).toBe(6);
        });

        it("should correctly calculate FULL_DAY_EVENT draft event position in the calendar", () => {
            (useEvents as Mock).mockReturnValue({
                events: mockEvents,
                draftEvent: {
                    kind: FULL_DAY_EVENT,
                    from: new Date(YEAR, MONTH, 1),
                    to: new Date(YEAR, MONTH, 9),
                    id: crypto.randomUUID(),
                    title: "Draft Event",
                    color: EVENT_COLORS[0],
                },
            });

            const { result } = renderHook(() => useCalendar());
            const { calendarDraftEvent } = result.current;

            const inFirstWeekDraftEvent = calendarDraftEvent?.[FIRST_WEEK];
            const inSecondWeekDraftEvent = calendarDraftEvent?.[SECOND_WEEK];

            expect(inFirstWeekDraftEvent?.colStart).toBe(6);
            expect(inFirstWeekDraftEvent?.colEnd).toBe(8);

            expect(inSecondWeekDraftEvent?.colStart).toBe(1);
            expect(inSecondWeekDraftEvent?.colEnd).toBe(8);
        });
    });

    describe("Sorting rules for FULL_DAY_EVENT", () => {
        it("should sort FULL_DAY_EVENT before DAY_EVENT", () => {
            const toBeFirstEvent = {
                kind: FULL_DAY_EVENT,
                from: new Date(YEAR, MONTH, 25), // 25th Nov 2024
                to: new Date(YEAR, MONTH + 1, 1), // 1st Dec 2024
                id: crypto.randomUUID(),
                title: "Test Event 2",
                color: EVENT_COLORS[0],
            } as Event;

            const toBeSecondEvent = {
                kind: DAY_EVENT,
                date: new Date(YEAR, MONTH, 26), // 26th Nov 2024
                startTime: new Date(YEAR, MONTH, 26, 10, 0), // 10:00
                endTime: new Date(YEAR, MONTH, 26, 12, 0), // 12:00
                id: crypto.randomUUID(),
                title: "Test Event 1",
                color: EVENT_COLORS[1],
            } as Event;

            (useEvents as Mock).mockReturnValue({
                events: [toBeSecondEvent, toBeFirstEvent],
            });

            checkEventOrder(toBeFirstEvent, toBeSecondEvent);
        });

        it("should sort by date", () => {
            const toBeFirstEvent = {
                kind: FULL_DAY_EVENT,
                from: new Date(YEAR, MONTH, 25), // 25th Nov 2024
                to: new Date(YEAR, MONTH + 1, 1), // 1st Dec 2024
                id: crypto.randomUUID(),
                title: "Test Event 2",
                color: EVENT_COLORS[0],
            } as Event;

            const toBeSecondEvent = {
                kind: FULL_DAY_EVENT,
                from: new Date(YEAR, MONTH, 27), // 27th Nov 2024
                to: new Date(YEAR, MONTH + 1, 1), // 1st Dec 2024
                id: crypto.randomUUID(),
                title: "Test Event 1",
                color: EVENT_COLORS[0],
            } as Event;

            (useEvents as Mock).mockReturnValue({
                events: [toBeSecondEvent, toBeFirstEvent],
            });

            checkEventOrder(toBeFirstEvent, toBeSecondEvent);
        });

        it("should sort by length", () => {
            const toBeFirstEvent = {
                kind: FULL_DAY_EVENT,
                from: new Date(YEAR, MONTH, 25), // 25th Nov 2024
                to: new Date(YEAR, MONTH + 1, 1), // 1st Dec 2024
                id: crypto.randomUUID(),
                title: "Test Event 2",
                color: EVENT_COLORS[0],
            } as Event;

            const toBeSecondEvent = {
                kind: FULL_DAY_EVENT,
                from: new Date(YEAR, MONTH, 25), // 25th Nov 2024
                to: new Date(YEAR, MONTH, 27), // 27th Nov 2024
                id: crypto.randomUUID(),
                title: "Test Event 1",
                color: EVENT_COLORS[0],
            } as Event;

            (useEvents as Mock).mockReturnValue({
                events: [toBeSecondEvent, toBeFirstEvent],
            });

            checkEventOrder(toBeFirstEvent, toBeSecondEvent);
        });

        it("should sort by title", () => {
            const toBeFirstEvent = {
                kind: FULL_DAY_EVENT,
                from: new Date(YEAR, MONTH, 25), // 25th Nov 2024
                to: new Date(YEAR, MONTH, 27), // 27th Nov 2024
                id: crypto.randomUUID(),
                title: "A",
                color: EVENT_COLORS[0],
            } as Event;

            const toBeSecondEvent = {
                kind: FULL_DAY_EVENT,
                from: new Date(YEAR, MONTH, 25), // 25th Nov 2024
                to: new Date(YEAR, MONTH, 27), // 27th Nov 2024
                id: crypto.randomUUID(),
                title: "B",
                color: EVENT_COLORS[0],
            } as Event;

            (useEvents as Mock).mockReturnValue({
                events: [toBeSecondEvent, toBeFirstEvent],
            });

            checkEventOrder(toBeFirstEvent, toBeSecondEvent);
        });

        it("should sort by color", () => {
            const toBeFirstEvent = {
                kind: FULL_DAY_EVENT,
                from: new Date(YEAR, MONTH, 25), // 25th Nov 2024
                to: new Date(YEAR, MONTH, 27), // 27th Nov 2024
                id: crypto.randomUUID(),
                title: "A",
                color: EVENT_COLORS[0],
            } as Event;

            const toBeSecondEvent = {
                kind: FULL_DAY_EVENT,
                from: new Date(YEAR, MONTH, 25), // 25th Nov 2024
                to: new Date(YEAR, MONTH, 27), // 27th Nov 2024
                id: crypto.randomUUID(),
                title: "A",
                color: EVENT_COLORS[1],
            } as Event;

            (useEvents as Mock).mockReturnValue({
                events: [toBeSecondEvent, toBeFirstEvent],
            });

            checkEventOrder(toBeFirstEvent, toBeSecondEvent);
        });
    });

    describe("Sorting rules for DAY_EVENT", () => {
        it("should sort by startTime", () => {
            const toBeFirstEvent = {
                kind: DAY_EVENT,
                date: new Date(YEAR, MONTH, 26), // 26th Nov 2024
                startTime: new Date(YEAR, MONTH, 26, 10, 0), // 10:00
                endTime: new Date(YEAR, MONTH, 26, 12, 0), // 12:00
                id: crypto.randomUUID(),
                title: "Test Event 2",
                color: EVENT_COLORS[1],
            } as Event;

            const toBeSecondEvent = {
                kind: DAY_EVENT,
                date: new Date(YEAR, MONTH, 26), // 26th Nov 2024
                startTime: new Date(YEAR, MONTH, 26, 11, 0), // 11:00
                endTime: new Date(YEAR, MONTH, 26, 12, 0), // 12:00
                id: crypto.randomUUID(),
                title: "Test Event 1",
                color: EVENT_COLORS[1],
            } as Event;

            (useEvents as Mock).mockReturnValue({
                events: [toBeSecondEvent, toBeFirstEvent],
            });

            checkEventOrder(toBeFirstEvent, toBeSecondEvent);
        });

        it("should sort by endTime", () => {
            const toBeFirstEvent = {
                kind: DAY_EVENT,
                date: new Date(YEAR, MONTH, 26), // 26th Nov 2024
                startTime: new Date(YEAR, MONTH, 26, 10, 0), // 10:00
                endTime: new Date(YEAR, MONTH, 26, 11, 0), // 11:00
                id: crypto.randomUUID(),
                title: "Test Event 2",
                color: EVENT_COLORS[1],
            } as Event;

            const toBeSecondEvent = {
                kind: DAY_EVENT,
                date: new Date(YEAR, MONTH, 26), // 26th Nov 2024
                startTime: new Date(YEAR, MONTH, 26, 10, 0), // 10:00
                endTime: new Date(YEAR, MONTH, 26, 12, 0), // 12:00
                id: crypto.randomUUID(),
                title: "Test Event 1",
                color: EVENT_COLORS[1],
            } as Event;

            (useEvents as Mock).mockReturnValue({
                events: [toBeSecondEvent, toBeFirstEvent],
            });

            checkEventOrder(toBeFirstEvent, toBeSecondEvent);
        });

        it("should sort by title", () => {
            const toBeFirstEvent = {
                kind: DAY_EVENT,
                date: new Date(YEAR, MONTH, 26), // 26th Nov 2024
                startTime: new Date(YEAR, MONTH, 26, 10, 0), // 10:00
                endTime: new Date(YEAR, MONTH, 26, 12, 0), // 12:00
                id: crypto.randomUUID(),
                title: "A",
                color: EVENT_COLORS[1],
            } as Event;

            const toBeSecondEvent = {
                kind: DAY_EVENT,
                date: new Date(YEAR, MONTH, 26), // 26th Nov 2024
                startTime: new Date(YEAR, MONTH, 26, 10, 0), // 10:00
                endTime: new Date(YEAR, MONTH, 26, 12, 0), // 12:00
                id: crypto.randomUUID(),
                title: "B",
                color: EVENT_COLORS[1],
            } as Event;

            (useEvents as Mock).mockReturnValue({
                events: [toBeSecondEvent, toBeFirstEvent],
            });

            checkEventOrder(toBeFirstEvent, toBeSecondEvent);
        });

        it("should sort by color", () => {
            const toBeFirstEvent = {
                kind: DAY_EVENT,
                date: new Date(YEAR, MONTH, 26), // 26th Nov 2024
                startTime: new Date(YEAR, MONTH, 26, 10, 0), // 10:00
                endTime: new Date(YEAR, MONTH, 26, 12, 0), // 12:00
                id: crypto.randomUUID(),
                title: "A",
                color: EVENT_COLORS[1],
            } as Event;

            const toBeSecondEvent = {
                kind: DAY_EVENT,
                date: new Date(YEAR, MONTH, 26), // 26th Nov 2024
                startTime: new Date(YEAR, MONTH, 26, 10, 0), // 10:00
                endTime: new Date(YEAR, MONTH, 26, 12, 0), // 12:00
                id: crypto.randomUUID(),
                title: "A",
                color: EVENT_COLORS[2],
            } as Event;

            (useEvents as Mock).mockReturnValue({
                events: [toBeSecondEvent, toBeFirstEvent],
            });

            checkEventOrder(toBeFirstEvent, toBeSecondEvent);
        });
    });
});
