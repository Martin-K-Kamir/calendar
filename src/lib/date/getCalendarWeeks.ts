import { eachWeekOfInterval } from "date-fns";

export function getCalendarWeeks(start: Date, end: Date, weekStartDay: 0 | 1) {
    return eachWeekOfInterval({ start, end }, { weekStartsOn: weekStartDay });
}
