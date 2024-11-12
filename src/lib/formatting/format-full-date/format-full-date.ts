import { formatDate } from "../format-date";

export function formatFullDate(date: Date) {
    return formatDate(date, {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}
