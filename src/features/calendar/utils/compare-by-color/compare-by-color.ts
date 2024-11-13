import { EVENT_COLORS } from "@/providers/events-provider";

export function compareByColor(
    a: (typeof EVENT_COLORS)[number],
    b: (typeof EVENT_COLORS)[number]
) {
    return EVENT_COLORS.indexOf(a) - EVENT_COLORS.indexOf(b);
}
