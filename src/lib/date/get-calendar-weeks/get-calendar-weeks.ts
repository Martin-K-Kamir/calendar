import { eachWeekOfInterval } from "date-fns";
import { WeekStartsOn } from "@/types";
import { getFirstWeek, getLastWeek } from "@/lib";

export function getCalendarWeeks(
    selectedMonth: Date,
    weekStartsOn: WeekStartsOn
) {
    const start = getFirstWeek(selectedMonth, weekStartsOn);
    const end = getLastWeek(selectedMonth, weekStartsOn);
    return eachWeekOfInterval({ start, end }, { weekStartsOn });
}
