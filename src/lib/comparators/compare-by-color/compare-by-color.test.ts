import { describe, it, expect } from "vitest";
import { compareByColor } from "./compare-by-color";
import { EVENT_COLORS } from "@/providers/events-provider";

describe("compareByColor()", () => {
    it("should return 0 when colors are the same", () => {
        const color = EVENT_COLORS[0];
        expect(compareByColor(color, color)).toBe(0);
    });

    it("should return a negative number when the first color comes before the second color", () => {
        const firstColor = EVENT_COLORS[0];
        const secondColor = EVENT_COLORS[1];
        expect(compareByColor(firstColor, secondColor)).toBeLessThan(0);
    });

    it("should return a positive number when the first color comes after the second color", () => {
        const firstColor = EVENT_COLORS[1];
        const secondColor = EVENT_COLORS[0];
        expect(compareByColor(firstColor, secondColor)).toBeGreaterThan(0);
    });

    it("should handle colors not in the EVENT_COLORS array", () => {
        const colorNotInArray = "not-in-array";
        const colorInArray = EVENT_COLORS[0];
        expect(compareByColor(colorNotInArray as any, colorInArray)).toBe(-1);
        expect(compareByColor(colorInArray, colorNotInArray as any)).toBe(1);
    });
});
