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
import { useSettings } from "@/hooks/useSettings";
import { useEvents } from "@/hooks/useEvents";
import { DayEvent, Event, FullDayEvent } from "@/providers/EventsProvider";
import {
    getDay,
    getFirstWeek,
    getLastWeek,
    getWeekIndex,
    getColStart,
    getColEnd,
    getCalendarWeeks,
    hasOverlapingWeek,
    compareFullDayEvents,
    compareDayEvents,
} from "@/lib";

type CalendarEventCell = {
    event: Event;
    colStart: number;
    colEnd: number;
};

function useCalendar() {
    const { weekStartDay } = useSettings();
    const { events } = useEvents();
    const [selectedMonth, setSelectedMonth] = useState(new Date());

    const calendarDays = useMemo(() => {
        const firstWeek = getFirstWeek(selectedMonth, weekStartDay);
        const lastWeek = getLastWeek(selectedMonth, weekStartDay);
        return eachDayOfInterval({ start: firstWeek, end: lastWeek });
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

    const calendarEvents = useMemo(() => {
        const firstWeek = getFirstWeek(selectedMonth, weekStartDay);
        const lastWeek = getLastWeek(selectedMonth, weekStartDay);
        const weeks = getCalendarWeeks(firstWeek, lastWeek, weekStartDay);
        const calendarEventsMatrix: CalendarEventCell[][] = weeks.map(() => []);

        sortedEvents.forEach(event => {
            if (event.kind === "FULL_DAY_EVENT") {
                fillWithFullDayEvents(event, weeks, calendarEventsMatrix);
            } else if (event.kind === "DAY_EVENT") {
                fillWithDayEvents(event, weeks, calendarEventsMatrix);
            }
        });

        return calendarEventsMatrix;
    }, [selectedMonth, weekStartDay, sortedEvents]);

    const calendarWeeks = useMemo(() => {
        const firstWeek = getFirstWeek(selectedMonth, weekStartDay);
        const lastWeek = getLastWeek(selectedMonth, weekStartDay);
        const weeks = getCalendarWeeks(firstWeek, lastWeek, weekStartDay);

        return weeks.map(weekStart => {
            const start = startOfWeek(weekStart, {
                weekStartsOn: weekStartDay,
            });
            const end = endOfWeek(weekStart, { weekStartsOn: weekStartDay });
            return eachDayOfInterval({ start, end });
        });
    }, [selectedMonth, weekStartDay]);

    function fillWithFullDayEvents(
        event: FullDayEvent,
        weeks: Date[],
        calendarEventsMatrix: CalendarEventCell[][]
    ) {
        const from = startOfDay(event.from);
        const to = endOfDay(event.to);
        const startWeekIndex = getWeekIndex(weeks, from, weekStartDay);
        const endWeekIndex = getWeekIndex(weeks, to, weekStartDay);

        const isOverlappingBefore = hasOverlapingWeek(
            endWeekIndex,
            startWeekIndex
        );

        const isOverlappingAfter = hasOverlapingWeek(
            startWeekIndex,
            endWeekIndex
        );

        if (startWeekIndex === -1 && endWeekIndex === -1) {
            return;
        }

        for (
            let i = Math.max(startWeekIndex, 0);
            i <= Math.max(endWeekIndex, startWeekIndex);
            i++
        ) {
            calendarEventsMatrix[i].push({
                event,
                colStart: getColStart(
                    i,
                    startWeekIndex,
                    getDay(from),
                    isOverlappingAfter
                ),
                colEnd: getColEnd(
                    i,
                    endWeekIndex,
                    getDay(to),
                    isOverlappingBefore
                ),
            });
        }
    }

    function fillWithDayEvents(
        event: DayEvent,
        weeks: Date[],
        calendarEventsMatrix: CalendarEventCell[][]
    ) {
        const day = startOfDay(event.date);
        const weekIndex = getWeekIndex(weeks, day, weekStartDay);

        if (weekIndex === -1) {
            return;
        }

        const dayOfWeek = getDay(day);

        calendarEventsMatrix[weekIndex].push({
            event,
            colStart: dayOfWeek + 1,
            colEnd: dayOfWeek + 2,
        });
    }

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
        calendarWeeks,
        handleNextMonth,
        handlePreviousMonth,
        handleToday,
    } as const;
}

export { type CalendarEventCell as CalendarEventCell, useCalendar };
