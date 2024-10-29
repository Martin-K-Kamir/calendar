import {
    isSameWeek,
} from "date-fns";

export function getWeekIndex(weeks: Date[], date: Date, weekStartsOn: 0 | 1) {
    return weeks.findIndex(weekStart =>
        isSameWeek(weekStart, date, {
            weekStartsOn,
        })
    );
}