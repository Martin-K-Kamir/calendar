import { startOfDay, endOfDay } from "date-fns";
import { getDay, getWeekIndex, isDateRangeInMonth } from "@/lib";
import { WeekStartsOn } from "@/types";
import { type FullDayEvent, type CalendarEventCell } from "@/features/calendar";
import { getColStart, getColEnd } from "@/features/calendar/utils";

export function categorizeFullDayEvent(
    event: FullDayEvent,
    weeks: Date[],
    matrix: CalendarEventCell[][],
    selectedMonth: Date,
    weekStartDay: WeekStartsOn
) {
    const from = startOfDay(event.from);
    const to = endOfDay(event.to);
    const startWeekIndex = getWeekIndex(weeks, from, weekStartDay);
    const endWeekIndex = getWeekIndex(weeks, to, weekStartDay);
    const isOverlappingBefore = hasOverlapingWeek(endWeekIndex, startWeekIndex);
    const isOverlappingAfter = hasOverlapingWeek(startWeekIndex, endWeekIndex);
    const isInDateRange = isDateRangeInMonth(from, to, selectedMonth);
    let lastWeekIndexOfMonth = 0;

    if (startWeekIndex === -1 && endWeekIndex === -1 && !isInDateRange) {
        return;
    }

    if (isInDateRange && endWeekIndex === -1) {
        lastWeekIndexOfMonth = weeks.length - 1;
    }

    for (
        let i = Math.max(startWeekIndex, 0);
        i <= Math.max(endWeekIndex, startWeekIndex, lastWeekIndexOfMonth);
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

function hasOverlapingWeek(a: number, b: number) {
    return a === -1 && b > a;
}
