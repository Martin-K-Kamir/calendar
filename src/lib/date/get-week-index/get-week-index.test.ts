import { describe, it, expect } from "vitest";
import { YEAR } from "@/testConstants";
import { getWeekIndex } from "./get-week-index";

describe("getWeekIndex()", () => {
    it("should return the correct index when the date is in the same week", () => {
        const weeks = [
            new Date(YEAR, 0, 1),
            new Date(YEAR, 0, 8),
            new Date(YEAR, 0, 15),
        ];
        const date = new Date(YEAR, 0, 10);
        const index = getWeekIndex(weeks, date, 0);

        expect(index).toBe(1);
    });

    it("should return -1 when the date is not in any of the weeks", () => {
        const weeks = [
            new Date(YEAR, 0, 1),
            new Date(YEAR, 0, 8),
            new Date(YEAR, 0, 15),
        ];
        const date = new Date(YEAR, 0, 22);
        const index = getWeekIndex(weeks, date, 0);

        expect(index).toBe(-1);
    });

    it("should handle different week start days correctly", () => {
        const weeks = [
            new Date(YEAR, 0, 1),
            new Date(YEAR, 0, 8),
            new Date(YEAR, 0, 15),
        ];
        const date = new Date(YEAR, 0, 10);
        const index = getWeekIndex(weeks, date, 1);

        expect(index).toBe(1);
    });
});
