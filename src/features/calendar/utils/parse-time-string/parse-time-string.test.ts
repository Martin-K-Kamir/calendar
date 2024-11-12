import { describe, it, expect } from "vitest";
import { parseTimeString } from "./parse-time-string";

describe("parseTimeString()", () => {
    it("should parse time string without modifier correctly", () => {
        const result = parseTimeString("14:30");
        expect(result.getHours()).toBe(14);
        expect(result.getMinutes()).toBe(30);
    });

    it("should parse AM time string correctly", () => {
        const result = parseTimeString("2:30 am");
        expect(result.getHours()).toBe(2);
        expect(result.getMinutes()).toBe(30);
    });

    it("should parse PM time string correctly", () => {
        const result = parseTimeString("2:30 pm");
        expect(result.getHours()).toBe(14);
        expect(result.getMinutes()).toBe(30);
    });

    it("should handle 12 AM correctly", () => {
        const result = parseTimeString("12:00 am");
        expect(result.getHours()).toBe(0);
        expect(result.getMinutes()).toBe(0);
    });

    it("should handle 12 PM correctly", () => {
        const result = parseTimeString("12:00 pm");
        expect(result.getHours()).toBe(12);
        expect(result.getMinutes()).toBe(0);
    });
});
