import { WeekStartsOn } from "@/types";

export function getDay(date: Date, weekStartsOn: WeekStartsOn) {
    const day = date.getDay();
    return (day + 7 - weekStartsOn) % 7;
}
