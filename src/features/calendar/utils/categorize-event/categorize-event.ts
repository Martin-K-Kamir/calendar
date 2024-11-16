import { WeekStartsOn } from "@/types";
import { type Event, type CalendarEventCell } from "@/features/calendar";
import {
    categorizeDayEvent,
    categorizeFullDayEvent,
} from "@/features/calendar/utils";

export function categorizeEvent(
    event: Event,
    weeks: Date[],
    matrix: CalendarEventCell[][],
    selectedMonth: Date,
    weekStartDay: WeekStartsOn
) {
    if (event.kind === "FULL_DAY_EVENT") {
        categorizeFullDayEvent(
            event,
            weeks,
            matrix,
            selectedMonth,
            weekStartDay
        );
    } else if (event.kind === "DAY_EVENT") {
        categorizeDayEvent(event, weeks, matrix, weekStartDay);
    } else {
        const exhaustiveCheck: never = event;
        throw new Error(
            `Unhandled event kind: ${JSON.stringify(exhaustiveCheck)}`
        );
    }
}
