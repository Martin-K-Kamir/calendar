import { describe, it, expect, vi, type Mock } from "vitest";
import { formatLongDate } from "./format-long-date";
import { formatDate } from "../format-date";

vi.mock("../format-date");

describe("formatLongDate()", () => {
    it("should format the date with long weekday, 2-digit day, and long month", () => {
        const date = new Date(2024, 9, 5); // October 5, 2024
        const formattedDate = "Thursday, 05 October";

        (formatDate as Mock).mockReturnValue(formattedDate);

        const result = formatLongDate(date);

        expect(result).toBe(formattedDate);
        expect(formatDate).toHaveBeenCalledWith(date, {
            weekday: "long",
            day: "2-digit",
            month: "long",
        });
    });
});
