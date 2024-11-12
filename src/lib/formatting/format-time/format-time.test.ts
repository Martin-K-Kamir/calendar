import { describe, it, expect, vi, type Mock } from "vitest";
import { formatTime } from ".";
import { formatDate } from "../format-date";

vi.mock("../format-date");

describe("formatTime()", () => {
    it("should format the time correctly", () => {
        const date = new Date(2023, 0, 1, 13, 30);
        (formatDate as Mock).mockReturnValue("01:30 PM");

        const result = formatTime(date);

        expect(result).toBe("01:30 PM");
        expect(formatDate).toHaveBeenCalledWith(date, {
            hour: "2-digit",
            minute: "2-digit",
        });
    });
});
