import { eachWeekOfInterval } from "date-fns";
import { describe, it, expect, vi, type Mock } from "vitest";
import { YEAR } from "@/testing/constants";
import { getCalendarWeeks, getLastWeek, getFirstWeek } from "@/lib";

vi.mock("date-fns", () => ({
    eachWeekOfInterval: vi.fn(),
}));
vi.mock("@/lib/date/get-first-week");
vi.mock("@/lib/date/get-last-week");

describe("getCalendarWeeks()", () => {
    it("should call getFirstWeek and getLastWeek with the correct arguments", () => {
        const selectedMonth = new Date(YEAR, 9, 1);
        const weekStartsOn = 0;

        (getFirstWeek as Mock).mockReturnValue(new Date(YEAR, 8, 25));
        (getLastWeek as Mock).mockReturnValue(new Date(YEAR, 10, 5));
        (eachWeekOfInterval as Mock).mockReturnValue([]);

        getCalendarWeeks(selectedMonth, weekStartsOn);

        expect(getFirstWeek).toHaveBeenCalledWith(selectedMonth, weekStartsOn);
        expect(getLastWeek).toHaveBeenCalledWith(selectedMonth, weekStartsOn);
    });

    it("should call eachWeekOfInterval with the correct arguments", () => {
        const selectedMonth = new Date(YEAR, 9, 1);
        const weekStartsOn = 0;
        const start = new Date(YEAR, 8, 25);
        const end = new Date(YEAR, 10, 5);

        (getFirstWeek as Mock).mockReturnValue(start);
        (getLastWeek as Mock).mockReturnValue(end);
        (eachWeekOfInterval as Mock).mockReturnValue([]);

        getCalendarWeeks(selectedMonth, weekStartsOn);

        expect(eachWeekOfInterval).toHaveBeenCalledWith(
            { start, end },
            { weekStartsOn }
        );
    });

    it("should return the result of eachWeekOfInterval", () => {
        const selectedMonth = new Date(YEAR, 9, 1);
        const weekStartsOn = 0;
        const weeks = [
            new Date(YEAR, 8, 25),
            new Date(YEAR, 9, 2),
            new Date(YEAR, 9, 9),
            new Date(YEAR, 9, 16),
            new Date(YEAR, 9, 23),
            new Date(YEAR, 9, 30),
        ];

        (getFirstWeek as Mock).mockReturnValue(new Date(YEAR, 8, 25));
        (getLastWeek as Mock).mockReturnValue(new Date(YEAR, 10, 5));
        (eachWeekOfInterval as Mock).mockReturnValue(weeks);

        const result = getCalendarWeeks(selectedMonth, weekStartsOn);

        expect(result).toEqual(weeks);
    });
});
