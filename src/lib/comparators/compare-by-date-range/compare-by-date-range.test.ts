import { describe, it, expect } from "vitest";
import { compareByDateRange } from "@/lib";

describe("compareByDateRange()", () => {
    it("should return 0 if both objects have the same range", () => {
        const a = {
            from: new Date("2024-01-01"),
            to: new Date("2024-01-03"),
        };

        const b = {
            from: new Date("2024-01-01"),
            to: new Date("2024-01-03"),
        };

        expect(compareByDateRange(a, b)).toBe(0);
    });

    it("should return a positive number if object B has a longer range than object A", () => {
        const a = {
            from: new Date("2024-01-01"),
            to: new Date("2024-01-03"),
        };

        const b = {
            from: new Date("2024-01-01"),
            to: new Date("2024-01-05"),
        };

        expect(compareByDateRange(a, b)).toBeGreaterThan(0);
    });

    it("should return a negative number if object A has a longer range than object B", () => {
        const a = {
            from: new Date("2024-01-01"),
            to: new Date("2024-01-05"),
        };

        const b = {
            from: new Date("2024-01-01"),
            to: new Date("2024-01-04"),
        };

        expect(compareByDateRange(a, b)).toBeLessThan(0);
    });
});
