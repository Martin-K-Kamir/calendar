import { describe, it, expect, vi } from "vitest";
import { categorizeEvent } from "./categorize-event";
import { WeekStartsOn } from "@/types";
import { type Event, type CalendarEventCell } from "@/features/calendar";
import {
    categorizeDayEvent,
    categorizeFullDayEvent,
} from "@/features/calendar/utils";

vi.mock("@/features/calendar/utils", () => ({
    categorizeDayEvent: vi.fn(),
    categorizeFullDayEvent: vi.fn(),
}));

describe("categorizeEvent()", () => {
    const weeks: Date[] = [new Date()];
    const matrix: CalendarEventCell[][] = [[]];
    const selectedMonth = new Date();
    const weekStartDay: WeekStartsOn = 0;

    it("should call categorizeFullDayEvent for FULL_DAY_EVENT", () => {
        const event: Event = { kind: "FULL_DAY_EVENT" } as Event;

        categorizeEvent(event, weeks, matrix, selectedMonth, weekStartDay);

        expect(categorizeFullDayEvent).toHaveBeenCalledWith(
            event,
            weeks,
            matrix,
            selectedMonth,
            weekStartDay
        );
    });

    it("should call categorizeDayEvent for DAY_EVENT", () => {
        const event: Event = { kind: "DAY_EVENT" } as Event;

        categorizeEvent(event, weeks, matrix, selectedMonth, weekStartDay);

        expect(categorizeDayEvent).toHaveBeenCalledWith(
            event,
            weeks,
            matrix,
            weekStartDay
        );
    });

    it("should throw an error for unhandled event kind", () => {
        // @ts-expect-error Unhandled event kind
        const event: Event = { kind: "UNKNOWN_EVENT" } as Event;

        expect(() =>
            categorizeEvent(event, weeks, matrix, selectedMonth, weekStartDay)
        ).toThrowError('Unhandled event kind: {"kind":"UNKNOWN_EVENT"}');
    });
});
