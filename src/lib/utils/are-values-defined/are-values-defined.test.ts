import { describe, it, expect } from "vitest";
import { areValuesDefined } from "./are-values-defined";

describe("areValuesDefined()", () => {
    it("should return false if values is null", () => {
        expect(areValuesDefined(null)).toBe(false);
    });

    it("should return false if values is undefined", () => {
        expect(areValuesDefined(undefined)).toBe(false);
    });

    it("should return true if all values are defined", () => {
        const values = { a: 1, b: "test", c: true };
        expect(areValuesDefined(values)).toBe(true);
    });

    it("should return false if any value is undefined", () => {
        const values = { a: 1, b: undefined, c: true };
        expect(areValuesDefined(values)).toBe(false);
    });

    it("should return true if nested values are all defined", () => {
        const values = { a: 1, b: { c: "test", d: true } };
        expect(areValuesDefined(values)).toBe(true);
    });

    it("should return false if any nested value is undefined", () => {
        const values = { a: 1, b: { c: undefined, d: true } };
        expect(areValuesDefined(values)).toBe(false);
    });
});
