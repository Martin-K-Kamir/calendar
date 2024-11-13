import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getWeekdayNames } from "@/lib";

describe("getWeekdayNames()", () => {
    let spy: any;

    beforeEach(() => {
        const originalDateTimeFormat = Intl.DateTimeFormat;

        spy = vi
            .spyOn(Intl, "DateTimeFormat")
            .mockImplementation((_, options) => {
                return new originalDateTimeFormat("en-US", options);
            });
    });

    afterEach(() => {
        spy.mockRestore();
    });

    it("should return weekday names starting from Sunday", () => {
        const result = getWeekdayNames(0);

        expect(result).toEqual([
            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
        ]);
    });

    it("should return weekday names starting from Monday", () => {
        const result = getWeekdayNames(1);
        expect(result).toEqual([
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun",
        ]);
    });

    it("should return weekday names in a different locale", () => {
        spy.mockRestore();

        const result = getWeekdayNames(0, "fr-FR");
        expect(result).toEqual([
            "dim.",
            "lun.",
            "mar.",
            "mer.",
            "jeu.",
            "ven.",
            "sam.",
        ]);
    });
});
