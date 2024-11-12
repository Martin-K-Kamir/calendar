import { describe, it, expect } from "vitest";
import { compareByDateRange } from "./compare-by-date-range";
import { YEAR } from "@/testConstants";

describe("compareByDateRange()", () => {
    it("should return 0 if both events have the same span", () => {
        const eventA = {
            from: new Date(YEAR, 0, 1),
            to: new Date(YEAR, 0, 3),
        };

        const eventB = {
            from: new Date(YEAR, 1, 1),
            to: new Date(YEAR, 1, 3),
        };

        expect(compareByDateRange(eventA, eventB)).toBe(0);
    });

    it("should return a positive number if event B has a longer span than event A", () => {
        const eventA = {
            from: new Date(YEAR, 0, 1),
            to: new Date(YEAR, 0, 3),
        };

        const eventB = {
            from: new Date(YEAR, 1, 1),
            to: new Date(YEAR, 1, 5),
        };

        expect(compareByDateRange(eventA, eventB)).toBeGreaterThan(0);
    });

    it("should return a negative number if event A has a longer span than event B", () => {
        const eventA = {
            from: new Date(YEAR, 0, 1),
            to: new Date(YEAR, 0, 5),
        };

        const eventB = {
            from: new Date(YEAR, 1, 1),
            to: new Date(YEAR, 1, 3),
        };

        expect(compareByDateRange(eventA, eventB)).toBeLessThan(0);
    });
});
