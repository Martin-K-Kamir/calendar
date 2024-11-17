import { useMemo, useState } from "react";
import {
    eachDayOfInterval,
    subMonths,
    addMonths,
    startOfWeek,
    endOfWeek,
} from "date-fns";
import { useSettings } from "@/hooks/use-settings";
import { getCalendarWeeks, getCalendarDays } from "@/lib";
import {
    useEvents,
    FULL_DAY_EVENT,
    DAY_EVENT,
    type Event,
} from "@/features/calendar";
import {
    compareFullDayEvents,
    compareDayEvents,
    categorizeEvent,
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
            if (a.kind === FULL_DAY_EVENT && b.kind === FULL_DAY_EVENT) {
                return compareFullDayEvents(a, b);
            }

            if (a.kind === FULL_DAY_EVENT && b.kind === DAY_EVENT) {
                return -1;
            }

            if (a.kind === DAY_EVENT && b.kind === FULL_DAY_EVENT) {
                return 1;
            }

            if (a.kind === DAY_EVENT && b.kind === DAY_EVENT) {
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
            categorizeEvent(
                event,
                calendarWeeks,
                eventsMatrix,
                selectedMonth,
                weekStartDay
            )
        );

        return eventsMatrix;
    }, [calendarWeeks, sortedEvents, weekStartDay, selectedMonth]);

    const calendarDraftEvent = useMemo(() => {
        if (draftEvent == null) {
            return null;
        }

        const eventsMatrix: CalendarEventCell[][] = calendarWeeks.map(() => []);

        categorizeEvent(
            draftEvent,
            calendarWeeks,
            eventsMatrix,
            selectedMonth,
            weekStartDay
        );

        return eventsMatrix.map(week => {
            const [event] = week;

            if (event == null) {
                return null;
            }

            return event;
        });
    }, [calendarWeeks, draftEvent, weekStartDay, selectedMonth]);

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

export { type CalendarEventCell as CalendarEventCell, useCalendar };
