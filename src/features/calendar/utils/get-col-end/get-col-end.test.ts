import { describe, it, expect } from "vitest";
import { getColEnd } from "@/features/calendar/utils";

describe("getColEnd()", () => {
    it("should return 8 if isOverlapping is true", () => {
        expect(getColEnd(0, 0, 0, true)).toBe(8);
        expect(getColEnd(1, 1, 1, true)).toBe(8);
    });

    it("should return day + 2 if index equals weekIndex and isOverlapping is false", () => {
        expect(getColEnd(0, 0, 3, false)).toBe(5);
        expect(getColEnd(2, 2, 5, false)).toBe(7);
    });

    it("should return 8 if index does not equal weekIndex and isOverlapping is false", () => {
        expect(getColEnd(0, 1, 3, false)).toBe(8);
        expect(getColEnd(2, 3, 5, false)).toBe(8);
    });
});
