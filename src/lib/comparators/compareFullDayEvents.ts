import { FullDayEvent } from "@/providers/EventsProvider";
import { compareByColor } from "./compareByColor";
import { compareByDate } from "./compareByDate";
import { compareBySpan } from "./compareBySpan";
import { compareByTitle } from "./compareByTitle";

export function compareFullDayEvents(a: FullDayEvent, b: FullDayEvent): number {
    const dateComparison = compareByDate(a.from, b.from);
    if (dateComparison !== 0) return dateComparison;

    const spanComparison = compareBySpan(a, b);
    if (spanComparison !== 0) return spanComparison;

    const titleComparison = compareByTitle(a.title, b.title);
    if (titleComparison !== 0) return titleComparison;

    return compareByColor(a.color, b.color);
}
