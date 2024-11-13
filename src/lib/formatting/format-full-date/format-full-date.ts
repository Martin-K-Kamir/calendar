import { formatDate } from "@/lib";

export function formatFullDate(date: Date) {
    return formatDate(date, {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}
