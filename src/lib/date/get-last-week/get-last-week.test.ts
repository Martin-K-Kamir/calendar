import { describe, it, expect } from "vitest";
import { YEAR } from "@/testConstants";
import { getLastWeek } from "./get-last-week";

const LEAP_YEAR = 2024;
describe("getLastWeek()", () => {
    it("should return the last week of the month with week starting on Sunday", () => {
        const date = new Date(YEAR, 8, 15); // September 15 2024
        const result = getLastWeek(date, 0);
        expect(result).toEqual(new Date(YEAR, 9, 5, 23, 59, 59, 999)); // September 30 2024 is a Monday so the end of the week is October 5 2024
    });

    it("should return the last week of the month with week starting on Monday", () => {
        const date = new Date(YEAR, 8, 15); // September 15 2024
        const result = getLastWeek(date, 1);
        expect(result).toEqual(new Date(YEAR, 9, 6, 23, 59, 59, 999)); // September 30 2024 is a Monday so the end of the week is October 6 2024
    });

    it("should handle leap years correctly", () => {
        const date = new Date(LEAP_YEAR, 1, 15); // February 15 2024 (leap year)
        const result = getLastWeek(date, 0);
        expect(result).toEqual(new Date(LEAP_YEAR, 2, 2, 23, 59, 59, 999)); // February 29 2024 is a Thursday so the end of the week is March 2 2024
    });

    it("should handle different months correctly", () => {
        const date = new Date(YEAR, 0, 15); // January 15 2024
        const result = getLastWeek(date, 0);
        expect(result).toEqual(new Date(YEAR, 1, 3, 23, 59, 59, 999)); // January 31 2024 is a Wednesday so the end of the week is February 3 2024
    });
});
