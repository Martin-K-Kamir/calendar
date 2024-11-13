import { describe, it, expect, vi } from "vitest";
import { getMonthNames } from "@/lib";

describe("getMonthNames()", () => {
    it("should return month names in default locale", () => {
        const originalDateTimeFormat = Intl.DateTimeFormat;

        const spy = vi
            .spyOn(Intl, "DateTimeFormat")
            .mockImplementation((_, options) => {
                return new originalDateTimeFormat("en-US", options);
            });

        const monthNames = getMonthNames();
        expect(monthNames).toEqual([
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ]);

        spy.mockRestore();
    });
    it("should return month names in specified locale", () => {
        const monthNames = getMonthNames("es-ES");
        expect(monthNames).toEqual([
            "enero",
            "febrero",
            "marzo",
            "abril",
            "mayo",
            "junio",
            "julio",
            "agosto",
            "septiembre",
            "octubre",
            "noviembre",
            "diciembre",
        ]);
    });
});
