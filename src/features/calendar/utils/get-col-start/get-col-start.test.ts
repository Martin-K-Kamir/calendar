import { describe, it, expect } from "vitest";
import { getColStart } from "@/features/calendar/utils";

describe("getColStart()", () => {
    it("should return 1 if isOverlapping is true", () => {
        expect(getColStart(0, 0, 0, true)).toBe(1);
        expect(getColStart(1, 2, 3, true)).toBe(1);
    });

    it("should return day + 1 if index equals weekIndex and isOverlapping is false", () => {
        expect(getColStart(0, 0, 0, false)).toBe(1);
        expect(getColStart(1, 1, 3, false)).toBe(4);
    });

    it("should return 1 if index does not equal weekIndex and isOverlapping is false", () => {
        expect(getColStart(0, 1, 0, false)).toBe(1);
        expect(getColStart(2, 1, 3, false)).toBe(1);
    });
});
