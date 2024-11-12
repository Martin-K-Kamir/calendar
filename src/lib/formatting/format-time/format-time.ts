import { formatDate } from "../format-date";

export function formatTime(date: Date) {
    return formatDate(date, {
        hour: "2-digit",
        minute: "2-digit",
    });
}
