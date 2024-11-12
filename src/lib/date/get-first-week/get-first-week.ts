import { startOfWeek, startOfMonth } from "date-fns";
import { WeekStartsOn } from "@/types";

export function getFirstWeek(month: Date, weekStartsOn: WeekStartsOn) {
    return startOfWeek(startOfMonth(month), {
        weekStartsOn,
    });
}
