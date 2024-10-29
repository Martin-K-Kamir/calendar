import { DayEvent } from "@/providers/EventsProvider";
import { compareByColor } from "./compareByColor";
import { compareByDate } from "./compareByDate";
import { compareByTitle } from "./compareByTitle";

export function compareDayEvents(a: DayEvent, b: DayEvent): number {
    const startTimeComparison = compareByDate(a.startTime, b.startTime);
    if (startTimeComparison !== 0) return startTimeComparison;

    const endTimeComparison = compareByDate(a.endTime, b.endTime);
    if (endTimeComparison !== 0) return endTimeComparison;

    const titleComparison = compareByTitle(a.title, b.title);
    if (titleComparison !== 0) return titleComparison;

    return compareByColor(a.color, b.color);
}
