import { DayEvent } from "@/providers/events-provider";
import { compareByColor } from "@/features/calendar/utils";
import { compareByDate, compareByString } from "@/lib";

export function compareDayEvents(a: DayEvent, b: DayEvent) {
    const startTimeComparison = compareByDate(a.startTime, b.startTime);
    if (startTimeComparison !== 0) return startTimeComparison;

    const endTimeComparison = compareByDate(a.endTime, b.endTime);
    if (endTimeComparison !== 0) return endTimeComparison;

    const titleComparison = compareByString(a.title, b.title);
    if (titleComparison !== 0) return titleComparison;

    return compareByColor(a.color, b.color);
}
