import { describe, it, expect } from "vitest";
import { DayEvent } from "@/providers/events-provider";
import { YEAR, MONTH } from "@/testing/constants";
import { compareDayEvents } from "@/features/calendar/utils";

const event1 = {
    startTime: new Date(YEAR, MONTH, 1, 10, 0),
    endTime: new Date(YEAR, MONTH, 1, 11, 0),
    title: "Event 1",
    color: "red",
} as DayEvent;

const event2 = {
    startTime: new Date(YEAR, MONTH, 1, 12, 0),
    endTime: new Date(YEAR, MONTH, 1, 13, 0),
    title: "Event 2",
    color: "blue",
} as DayEvent;

describe("compareDayEvents()", () => {
    it("should return 0 if events are identical", () => {
        expect(compareDayEvents(event1, event1)).toBe(0);
    });

    it("should compare by start time", () => {
        const earlierEvent = {
            ...event1,
            startTime: new Date(YEAR, MONTH, 1, 9, 0),
        };
        expect(compareDayEvents(earlierEvent, event1)).toBeLessThan(0);
        expect(compareDayEvents(event1, earlierEvent)).toBeGreaterThan(0);
    });

    it("should compare by end time if start times are equal", () => {
        const laterEndEvent = {
            ...event1,
            endTime: new Date(YEAR, MONTH, 1, 12, 0),
        };
        expect(compareDayEvents(event1, laterEndEvent)).toBeLessThan(0);
        expect(compareDayEvents(laterEndEvent, event1)).toBeGreaterThan(0);
    });

    it("should compare by title if start and end times are equal", () => {
        expect(compareDayEvents(event1, event2)).toBeLessThan(0);
        expect(compareDayEvents(event2, event1)).toBeGreaterThan(0);
    });

    it("should compare by color if start times, end times, and titles are equal", () => {
        const sameTimeTitleEvent1 = { ...event1, color: "pink" } as DayEvent;
        const sameTimeTitleEvent2 = { ...event1, color: "green" } as DayEvent;
        expect(
            compareDayEvents(sameTimeTitleEvent1, sameTimeTitleEvent2)
        ).toBeLessThan(0);
        expect(
            compareDayEvents(sameTimeTitleEvent2, sameTimeTitleEvent1)
        ).toBeGreaterThan(0);
    });
});
