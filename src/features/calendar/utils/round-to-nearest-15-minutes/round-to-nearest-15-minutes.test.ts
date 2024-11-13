import { describe, it, expect } from "vitest";
import { YEAR } from "@/testing/constants";
import { roundToNearest15Minutes } from "@/features/calendar/utils";

describe("roundToNearest15Minutes()", () => {
    it("should round up to the nearest 15 minutes", () => {
        const date = new Date(YEAR, 0, 1, 10, 7); // 10:07
        const roundedDate = roundToNearest15Minutes(date);
        expect(roundedDate.getMinutes()).toBe(15);
    });

    it("should not change the date if already on a 15 minute mark", () => {
        const date = new Date(YEAR, 0, 1, 10, 30); // 10:30
        const roundedDate = roundToNearest15Minutes(date);
        expect(roundedDate.getMinutes()).toBe(30);
    });

    it("should handle edge case of exactly 15 minutes", () => {
        const date = new Date(YEAR, 0, 1, 10, 15); // 10:15
        const roundedDate = roundToNearest15Minutes(date);
        expect(roundedDate.getMinutes()).toBe(15);
    });

    it("should handle edge case of exactly 0 minutes", () => {
        const date = new Date(YEAR, 0, 1, 10, 0); // 10:00
        const roundedDate = roundToNearest15Minutes(date);
        expect(roundedDate.getMinutes()).toBe(0);
    });
});
