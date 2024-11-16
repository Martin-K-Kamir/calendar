import { describe, it, expect } from "vitest";
import { isDateRangeInMonth } from "./is-date-range-in-month";
import { parseISO } from "date-fns";

describe("isDateRangeInMonth()", () => {
    it("should return true if the date range is completely within the selected month", () => {
        const from = parseISO("2024-05-10");
        const to = parseISO("2024-05-20");
        const selectedMonth = parseISO("2024-05-01");
        expect(isDateRangeInMonth(from, to, selectedMonth)).toBe(true);
    });

    it("should return true if the start date is within the selected month", () => {
        const from = parseISO("2024-05-20");
        const to = parseISO("2024-06-05");
        const selectedMonth = parseISO("2024-05-01");
        expect(isDateRangeInMonth(from, to, selectedMonth)).toBe(true);
    });

    it("should return true if the end date is within the selected month", () => {
        const from = parseISO("2024-04-25");
        const to = parseISO("2024-05-05");
        const selectedMonth = parseISO("2024-05-01");
        expect(isDateRangeInMonth(from, to, selectedMonth)).toBe(true);
    });

    it("should return true if the date range spans the entire selected month", () => {
        const from = parseISO("2024-04-25");
        const to = parseISO("2024-06-05");
        const selectedMonth = parseISO("2024-05-01");
        expect(isDateRangeInMonth(from, to, selectedMonth)).toBe(true);
    });

    it("should return false if the date range is completely outside the selected month", () => {
        const from = parseISO("2024-04-01");
        const to = parseISO("2024-04-30");
        const selectedMonth = parseISO("2024-05-01");
        expect(isDateRangeInMonth(from, to, selectedMonth)).toBe(false);
    });

    it("should return false if the date range is completely after the selected month", () => {
        const from = parseISO("2024-06-01");
        const to = parseISO("2024-06-30");
        const selectedMonth = parseISO("2024-05-01");
        expect(isDateRangeInMonth(from, to, selectedMonth)).toBe(false);
    });
});
