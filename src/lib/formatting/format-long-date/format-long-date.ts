import { formatDate } from "@/lib";

export function formatLongDate(date: Date) {
    return formatDate(date, {
        weekday: "long",
        day: "2-digit",
        month: "long",
    });
}
