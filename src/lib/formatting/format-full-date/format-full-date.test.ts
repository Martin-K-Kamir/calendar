import { describe, it, expect, vi, type Mock } from "vitest";
import { formatDate, formatFullDate } from "@/lib";

vi.mock("@/lib/formatting/format-date");

describe("formatFullDate()", () => {
    it("should format the date correctly", () => {
        const date = new Date(2024, 9, 5); // October 5, 2024
        const formattedDate = "Thursday, October 05, 2024";

        (formatDate as Mock).mockReturnValue(formattedDate);

        const result = formatFullDate(date);
        expect(result).toBe(formattedDate);
        expect(formatDate).toHaveBeenCalledWith(date, {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    });
});
