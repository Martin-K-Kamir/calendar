import { describe, it, expect } from "vitest";
import { FullDayEvent } from "@/providers/events-provider";
import { YEAR, MONTH } from "@/testConstants";
import { compareFullDayEvents } from "./compare-full-day-events";

describe("compareFullDayEvents()", () => {
    const event1 = {
        from: new Date(YEAR, MONTH, 1),
        to: new Date(YEAR, MONTH, 2),
        title: "Event 1",
        color: "red",
    } as FullDayEvent;

    const event2 = {
        from: new Date(YEAR, MONTH, 2),
        to: new Date(YEAR, MONTH, 3),
        title: "Event 2",
        color: "blue",
    } as FullDayEvent;

    it("should compare by date", () => {
        const result = compareFullDayEvents(event1, event2);
        expect(result).toBeLessThan(0);
    });

    it("should compare by span if dates are equal", () => {
        const event3 = {
            ...event1,
            to: new Date(YEAR, MONTH, 1),
        };
        const result = compareFullDayEvents(event1, event3);
        expect(result).toBeLessThan(0);
    });

    it("should compare by title if dates and spans are equal", () => {
        const event4 = {
            ...event1,
            title: "Event 3",
        };
        const result = compareFullDayEvents(event1, event4);
        expect(result).toBeLessThan(0);
    });

    it("should compare by color if dates, spans, and titles are equal", () => {
        const event5 = {
            ...event1,
            color: "green",
        } as FullDayEvent;
        const result = compareFullDayEvents(event1, event5);
        expect(result).toBeGreaterThan(0);
    });

    it("should return 0 if all properties are equal", () => {
        const event6 = { ...event1 };
        const result = compareFullDayEvents(event1, event6);
        expect(result).toBe(0);
    });
});
