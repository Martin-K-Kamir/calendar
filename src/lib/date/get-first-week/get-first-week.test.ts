import { describe, it, expect } from "vitest";
import { YEAR } from "@/testConstants";
import { getFirstWeek } from "./get-first-week";

describe("getFirstWeek()", () => {
    it("should return the first week starting on Sunday", () => {
        const date = new Date(YEAR, 9, 15); // October 15 2024
        const result = getFirstWeek(date, 0);
        expect(result).toEqual(new Date(YEAR, 8, 29)); // September 29 2024
    });

    it("should return the first week starting on Monday", () => {
        const date = new Date(YEAR, 9, 15); // October 15 2024
        const result = getFirstWeek(date, 1);
        expect(result).toEqual(new Date(YEAR, 8, 30)); // September 30 2024
    });

    it("should handle months starting on Sunday", () => {
        const date = new Date(YEAR, 9, 1); // October 1 2024
        const result = getFirstWeek(date, 0);
        expect(result).toEqual(new Date(YEAR, 8, 29)); // September 29 2024
    });

    it("should handle months starting on Monday", () => {
        const date = new Date(YEAR, 9, 2); // October 2 2024
        const result = getFirstWeek(date, 1);
        expect(result).toEqual(new Date(YEAR, 8, 30)); // September 30 2024
    });
});
