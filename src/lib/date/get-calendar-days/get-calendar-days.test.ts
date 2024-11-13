import { eachDayOfInterval } from "date-fns";
import { describe, it, expect, vi, type Mock } from "vitest";
import { getCalendarDays, getLastWeek, getFirstWeek } from "@/lib";

vi.mock("date-fns", () => ({
    eachDayOfInterval: vi.fn(),
}));
vi.mock("@/lib/date/get-first-week");
vi.mock("@/lib/date/get-last-week");

describe("getCalendarDays()", () => {
    it("should return the correct days for a given month when week starts on Sunday", () => {
        const selectedMonth = new Date(2023, 0, 1);
        const weekStartsOn = 0;
        const start = new Date(2022, 11, 25);
        const end = new Date(2023, 1, 4);

        (getFirstWeek as Mock).mockReturnValue(start);
        (getLastWeek as Mock).mockReturnValue(end);
        (eachDayOfInterval as Mock).mockReturnValue([
            start,
            new Date(2022, 11, 26),
            new Date(2022, 11, 27),
            end,
        ]);

        const result = getCalendarDays(selectedMonth, weekStartsOn);

        expect(getFirstWeek).toHaveBeenCalledWith(selectedMonth, weekStartsOn);
        expect(getLastWeek).toHaveBeenCalledWith(selectedMonth, weekStartsOn);
        expect(eachDayOfInterval).toHaveBeenCalledWith({ start, end });
        expect(result).toEqual([
            start,
            new Date(2022, 11, 26),
            new Date(2022, 11, 27),
            end,
        ]);
    });

    it("should return the correct days for a given month when week starts on Monday", () => {
        const selectedMonth = new Date(2023, 0, 1);
        const weekStartsOn = 1;
        const start = new Date(2022, 11, 26);
        const end = new Date(2023, 1, 5);

        (getFirstWeek as Mock).mockReturnValue(start);
        (getLastWeek as Mock).mockReturnValue(end);
        (eachDayOfInterval as Mock).mockReturnValue([
            start,
            new Date(2022, 11, 27),
            new Date(2022, 11, 28),
            end,
        ]);

        const result = getCalendarDays(selectedMonth, weekStartsOn);

        expect(getFirstWeek).toHaveBeenCalledWith(selectedMonth, weekStartsOn);
        expect(getLastWeek).toHaveBeenCalledWith(selectedMonth, weekStartsOn);
        expect(eachDayOfInterval).toHaveBeenCalledWith({ start, end });
        expect(result).toEqual([
            start,
            new Date(2022, 11, 27),
            new Date(2022, 11, 28),
            end,
        ]);
    });
});
