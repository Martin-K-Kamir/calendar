import { describe, it, expect, vi, type Mock } from "vitest";
import { getCalendarDays } from "./get-calendar-days";
import { getFirstWeek } from "../get-first-week";
import { getLastWeek } from "../get-last-week";
import { eachDayOfInterval } from "date-fns";

vi.mock("../get-first-week");
vi.mock("../get-last-week");
vi.mock("date-fns", () => ({
    eachDayOfInterval: vi.fn(),
}));

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
