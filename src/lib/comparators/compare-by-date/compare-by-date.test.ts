import { describe, it, expect } from "vitest";
import { compareByDate } from "./compare-by-date";

describe("compareByDate()", () => {
    it("should return 0 when dates are equal", () => {
        const date1 = new Date("2023-01-01");
        const date2 = new Date("2023-01-01");
        expect(compareByDate(date1, date2)).toBe(0);
    });

    it("should return a negative number when the first date is earlier", () => {
        const date1 = new Date("2023-01-01");
        const date2 = new Date("2023-01-02");
        expect(compareByDate(date1, date2)).toBeLessThan(0);
    });

    it("should return a positive number when the first date is later", () => {
        const date1 = new Date("2023-01-02");
        const date2 = new Date("2023-01-01");
        expect(compareByDate(date1, date2)).toBeGreaterThan(0);
    });
});
