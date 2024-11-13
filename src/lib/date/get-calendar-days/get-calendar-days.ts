import { eachDayOfInterval } from "date-fns";
import { WeekStartsOn } from "@/types";
import { getFirstWeek, getLastWeek } from "@/lib";

export function getCalendarDays(
    selectedMonth: Date,
    weekStartsOn: WeekStartsOn
) {
    const start = getFirstWeek(selectedMonth, weekStartsOn);
    const end = getLastWeek(selectedMonth, weekStartsOn);
    return eachDayOfInterval({ start, end });
}
