import { useMemo, useState } from "react";
import {
    eachDayOfInterval,
    subMonths,
    addMonths,
    startOfDay,
    endOfDay,
    startOfWeek,
    endOfWeek,
} from "date-fns";
import { useSettings } from "@/hooks/use-settings";
import { getDay, getWeekIndex, getCalendarWeeks, getCalendarDays } from "@/lib";
import { WeekStartsOn } from "@/types";
import {
    useEvents,
    type DayEvent,
    type Event,
    type FullDayEvent,
} from "@/features/calendar";
import {
    getColStart,
    getColEnd,
    compareFullDayEvents,
    compareDayEvents,
} from "@/features/calendar/utils";

type Cell = {
    colStart: number;
    colEnd: number;
};

type CalendarEventCell = Cell & {
    event: Event;
};

function useCalendar() {
    const { weekStartDay } = useSettings();
    const { events, draftEvent } = useEvents();
    const [selectedMonth, setSelectedMonth] = useState(new Date());

    const calendarWeeks = useMemo(() => {
        return getCalendarWeeks(selectedMonth, weekStartDay);
    }, [selectedMonth, weekStartDay]);

    const calendarDays = useMemo(() => {
        return getCalendarDays(selectedMonth, weekStartDay);
    }, [selectedMonth, weekStartDay]);

    const sortedEvents = useMemo(() => {
        return events.sort((a, b) => {
            if (a.kind === "FULL_DAY_EVENT" && b.kind === "FULL_DAY_EVENT") {
                return compareFullDayEvents(a, b);
            }

            if (a.kind === "FULL_DAY_EVENT" && b.kind === "DAY_EVENT") {
                return -1;
            }

            if (a.kind === "DAY_EVENT" && b.kind === "FULL_DAY_EVENT") {
                return 1;
            }

            if (a.kind === "DAY_EVENT" && b.kind === "DAY_EVENT") {
                return compareDayEvents(a, b);
            }

            return 0;
        });
    }, [events]);

    const calendarWeeksWithDays = useMemo(() => {
        return calendarWeeks.map(weekStart => {
            const start = startOfWeek(weekStart, {
                weekStartsOn: weekStartDay,
            });
            const end = endOfWeek(weekStart, { weekStartsOn: weekStartDay });
            return eachDayOfInterval({ start, end });
        });
    }, [calendarWeeks, weekStartDay]);

    const calendarEvents = useMemo(() => {
        const eventsMatrix: CalendarEventCell[][] = calendarWeeks.map(() => []);

        sortedEvents.forEach(event =>
            categorizeEvent(event, calendarWeeks, eventsMatrix, weekStartDay)
        );

        return eventsMatrix;
    }, [calendarWeeks, sortedEvents, weekStartDay]);

    const calendarDraftEvent = useMemo(() => {
        if (draftEvent == null) {
            return null;
        }

        const eventsMatrix: CalendarEventCell[][] = calendarWeeks.map(() => []);

        categorizeEvent(draftEvent, calendarWeeks, eventsMatrix, weekStartDay);

        return eventsMatrix.map(week => {
            const [event] = week;

            if (event == null) {
                return null;
            }

            return event;
        });
    }, [calendarWeeks, draftEvent, weekStartDay]);

    function handleNextMonth() {
        setSelectedMonth(prev => addMonths(prev, 1));
    }

    function handlePreviousMonth() {
        setSelectedMonth(prev => subMonths(prev, 1));
    }

    function handleToday() {
        setSelectedMonth(new Date());
    }

    return {
        selectedMonth,
        calendarDays,
        calendarEvents,
        calendarWeeksWithDays,
        calendarDraftEvent,
        handleNextMonth,
        handlePreviousMonth,
        handleToday,
    } as const;
}

function categorizeEvent(
    event: Event,
    weeks: Date[],
    matrix: CalendarEventCell[][],
    weekStartDay: WeekStartsOn
) {
    if (event.kind === "FULL_DAY_EVENT") {
        categorizeFullDayEvent(event, weeks, matrix, weekStartDay);
    } else if (event.kind === "DAY_EVENT") {
        categorizeDayEvent(event, weeks, matrix, weekStartDay);
    } else {
        const exhaustiveCheck: never = event;
        throw new Error(`Unhandled event kind: ${exhaustiveCheck}`);
    }
}

function categorizeFullDayEvent(
    event: FullDayEvent,
    weeks: Date[],
    matrix: CalendarEventCell[][],
    weekStartDay: WeekStartsOn
) {
    const from = startOfDay(event.from);
    const to = endOfDay(event.to);
    const startWeekIndex = getWeekIndex(weeks, from, weekStartDay);
    const endWeekIndex = getWeekIndex(weeks, to, weekStartDay);
    const isOverlappingBefore = hasOverlapingWeek(endWeekIndex, startWeekIndex);
    const isOverlappingAfter = hasOverlapingWeek(startWeekIndex, endWeekIndex);

    if (startWeekIndex === -1 && endWeekIndex === -1) {
        return;
    }

    for (
        let i = Math.max(startWeekIndex, 0);
        i <= Math.max(endWeekIndex, startWeekIndex);
        i++
    ) {
        matrix[i].push({
            event,
            colStart: getColStart(
                i,
                startWeekIndex,
                getDay(from, weekStartDay),
                isOverlappingAfter
            ),
            colEnd: getColEnd(
                i,
                endWeekIndex,
                getDay(to, weekStartDay),
                isOverlappingBefore
            ),
        });
    }
}

function categorizeDayEvent(
    event: DayEvent,
    weeks: Date[],
    matrix: CalendarEventCell[][],
    weekStartDay: 0 | 1 = 0
) {
    const day = startOfDay(event.date);
    const weekIndex = getWeekIndex(weeks, day, weekStartDay);

    if (weekIndex === -1) {
        return;
    }

    const dayOfWeek = getDay(day, weekStartDay);

    matrix[weekIndex].push({
        event,
        colStart: dayOfWeek + 1,
        colEnd: dayOfWeek + 2,
    });
}

function hasOverlapingWeek(a: number, b: number) {
    return a === -1 && b > a;
}

export { type CalendarEventCell as CalendarEventCell, useCalendar };
