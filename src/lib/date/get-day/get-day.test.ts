import { describe, it, expect } from "vitest";
import { YEAR } from "@/testing/constants";
import { getDay } from "@/lib";

describe("getDay()", () => {
    it("should return the correct day when week starts on Monday", () => {
        const date = new Date(Date.UTC(YEAR, 9, 2)); // Wednesday
        expect(getDay(date, 1)).toBe(2);
    });

    it("should return the correct day when week starts on Sunday", () => {
        const date = new Date(Date.UTC(YEAR, 9, 2)); // Wednesday
        expect(getDay(date, 0)).toBe(3);
    });

    it("should return 0 for Sunday when week starts on Sunday", () => {
        const date = new Date(Date.UTC(YEAR, 8, 29)); // Sunday
        expect(getDay(date, 0)).toBe(0);
    });

    it("should return 6 for Sunday when week starts on Monday", () => {
        const date = new Date(Date.UTC(YEAR, 8, 29)); // Sunday
        expect(getDay(date, 1)).toBe(6);
    });

    it("should return 0 for Monday when week starts on Monday", () => {
        const date = new Date(Date.UTC(YEAR, 8, 30)); // Monday
        expect(getDay(date, 1)).toBe(0);
    });

    it("should return 1 for Tuesday when week starts on Monday", () => {
        const date = new Date(Date.UTC(YEAR, 9, 1)); // Tuesday
        expect(getDay(date, 1)).toBe(1);
    });
});
