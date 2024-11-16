import { startOfDay } from "date-fns";
import { getDay, getWeekIndex } from "@/lib";
import { WeekStartsOn } from "@/types";
import { type DayEvent, type CalendarEventCell } from "@/features/calendar";

export function categorizeDayEvent(
    event: DayEvent,
    weeks: Date[],
    matrix: CalendarEventCell[][],
    weekStartDay: WeekStartsOn
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
