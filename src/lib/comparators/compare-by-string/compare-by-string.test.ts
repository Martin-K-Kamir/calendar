import { describe, it, expect } from "vitest";
import { compareByString } from "./compare-by-string";

describe("compareByString()", () => {
    it("should return 0 when strings are equal", () => {
        expect(compareByString("apple", "apple")).toBe(0);
    });

    it("should return a negative number when the first string comes before the second string", () => {
        expect(compareByString("apple", "banana")).toBeLessThan(0);
    });

    it("should return a positive number when the first string comes after the second string", () => {
        expect(compareByString("banana", "apple")).toBeGreaterThan(0);
    });

    it("should handle empty strings correctly", () => {
        expect(compareByString("", "")).toBe(0);
        expect(compareByString("apple", "")).toBeGreaterThan(0);
        expect(compareByString("", "apple")).toBeLessThan(0);
    });
});
