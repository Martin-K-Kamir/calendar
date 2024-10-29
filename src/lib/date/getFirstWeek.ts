import { startOfWeek, startOfMonth } from "date-fns";

export function getFirstWeek(month: Date, weekStartsOn: 0 | 1) {
    return startOfWeek(startOfMonth(month), {
        weekStartsOn,
    });
}
