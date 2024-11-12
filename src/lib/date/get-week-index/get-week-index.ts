import { isSameWeek } from "date-fns";
import { WeekStartsOn } from "@/types";

export function getWeekIndex(
    weeks: Date[],
    date: Date,
    weekStartsOn: WeekStartsOn
) {
    return weeks.findIndex(weekStart =>
        isSameWeek(weekStart, date, {
            weekStartsOn,
        })
    );
}
