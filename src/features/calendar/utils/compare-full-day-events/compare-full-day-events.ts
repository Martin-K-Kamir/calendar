import { FullDayEvent } from "@/providers/events-provider";
import { compareByColor } from "@/features/calendar/utils";
import { compareByDate, compareByDateRange, compareByString } from "@/lib";

export function compareFullDayEvents(a: FullDayEvent, b: FullDayEvent) {
    const dateComparison = compareByDate(a.from, b.from);
    if (dateComparison !== 0) return dateComparison;

    const spanComparison = compareByDateRange(a, b);
    if (spanComparison !== 0) return spanComparison;

    const titleComparison = compareByString(a.title, b.title);
    if (titleComparison !== 0) return titleComparison;

    return compareByColor(a.color, b.color);
}
