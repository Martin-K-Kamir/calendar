import { formatDate } from "../format-date";

export function formatLongDate(date: Date) {
    return formatDate(date, {
        weekday: "long",
        day: "2-digit",
        month: "long",
    });
}
