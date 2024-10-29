import { differenceInDays } from "date-fns";
import { FullDayEvent } from "@/providers/EventsProvider";

export function compareBySpan(a: FullDayEvent, b: FullDayEvent): number {
    return differenceInDays(b.to, b.from) - differenceInDays(a.to, a.from);
}
