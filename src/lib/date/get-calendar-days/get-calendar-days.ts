import { eachDayOfInterval } from "date-fns";
import { getFirstWeek } from "../get-first-week";
import { getLastWeek } from "../get-last-week";
import { WeekStartsOn } from "@/types";

export function getCalendarDays(
    selectedMonth: Date,
    weekStartsOn: WeekStartsOn
) {
    const start = getFirstWeek(selectedMonth, weekStartsOn);
    const end = getLastWeek(selectedMonth, weekStartsOn);
    return eachDayOfInterval({ start, end });
}
