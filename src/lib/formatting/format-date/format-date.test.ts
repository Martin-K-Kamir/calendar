import { describe, it, expect, vi } from "vitest";
import { formatDate } from "@/lib";

describe("formatDate()", () => {
    it("should call Intl.DateTimeFormat with the correct arguments", () => {
        const date = new Date(2024, 0, 1);
        const options = {
            month: "long",
            day: "numeric",
            year: "numeric",
        } as Intl.DateTimeFormatOptions;
        const spy = vi.spyOn(Intl, "DateTimeFormat");

        formatDate(date, options);

        expect(spy).toHaveBeenCalledWith(undefined, options);
    });
});
