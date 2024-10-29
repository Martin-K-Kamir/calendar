import { endOfWeek, endOfMonth } from "date-fns";

export function getLastWeek(month: Date, weekStartsOn: 0 | 1) {
    return endOfWeek(endOfMonth(month), {
        weekStartsOn,
    });
}
