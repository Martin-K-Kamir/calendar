import { formatDate } from "./formatDate";

export function formatLongDate(date: Date) {
    return formatDate(date, {
        weekday: "long",
        day: "2-digit",
        month: "long",
    });
}
