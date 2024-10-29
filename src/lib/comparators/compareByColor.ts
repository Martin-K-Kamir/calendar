import { EVENT_COLORS } from "@/providers/EventsProvider";

export function compareByColor(
    a: (typeof EVENT_COLORS)[number],
    b: (typeof EVENT_COLORS)[number]
): number {
    return EVENT_COLORS.indexOf(a) - EVENT_COLORS.indexOf(b);
}
