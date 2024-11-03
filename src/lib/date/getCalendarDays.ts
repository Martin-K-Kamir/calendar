import { eachDayOfInterval } from "date-fns";
import { getFirstWeek } from "./getFirstWeek";
import { getLastWeek } from "./getLastWeek";

export function getCalendarDays(selectedMonth: Date, weekStartsOn: 0 | 1) {
    const start = getFirstWeek(selectedMonth, weekStartsOn);
    const end = getLastWeek(selectedMonth, weekStartsOn);
    return eachDayOfInterval({ start, end });
}
