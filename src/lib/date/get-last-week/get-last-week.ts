import { endOfWeek, endOfMonth } from "date-fns";
import { WeekStartsOn } from "@/types";

export function getLastWeek(month: Date, weekStartsOn: WeekStartsOn) {
    return endOfWeek(endOfMonth(month), {
        weekStartsOn,
    });
}
