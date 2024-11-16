import { describe, it, expect, vi, type Mock } from "vitest";
import { categorizeDayEvent } from "./categorize-day-event";
import { getDay, getWeekIndex } from "@/lib";
import { WeekStartsOn } from "@/types";
import { type DayEvent, type CalendarEventCell } from "@/features/calendar";

vi.mock("@/lib", () => ({
    getDay: vi.fn(),
    getWeekIndex: vi.fn(),
}));

describe("categorizeDayEvent()", () => {
    const weekStartDay: WeekStartsOn = 0; // Sunday
    const weeks = [
        new Date(2024, 9, 29), // 29th October 2024 (Sunday)
        new Date(2024, 10, 5), // 5th November 2024 (Sunday)
        new Date(2024, 10, 12), // 12th November 2024 (Sunday)
        new Date(2024, 10, 19), // 19th November 2024 (Sunday)
        new Date(2024, 10, 26), // 26th November 2024 (Sunday)
    ];
    const matrix: CalendarEventCell[][] = weeks.map(() => []);

    it("should categorize a day event correctly", () => {
        const event = {
            date: new Date(2024, 10, 7),
        } as DayEvent;

        (getWeekIndex as Mock).mockReturnValue(1);
        (getDay as Mock).mockReturnValue(4);

        categorizeDayEvent(event, weeks, matrix, weekStartDay);

        expect(matrix[1]).toHaveLength(1);
        expect(matrix[1][0]).toEqual({
            event,
            colStart: 5, // Thursday + 1
            colEnd: 6, // Thursday + 2
        });
    });

    it("should categorize a day event correctly when week starts on Monday", () => {
        const event = {
            date: new Date(2024, 10, 7),
        } as DayEvent;
        const weekStartDay: WeekStartsOn = 1;
        const weeks = [
            new Date(2024, 9, 29), // 29th October 2024 (Sunday)
            new Date(2024, 10, 5), // 5th November 2024 (Sunday)
            new Date(2024, 10, 12), // 12th November 2024 (Sunday)
            new Date(2024, 10, 19), // 19th November 2024 (Sunday)
            new Date(2024, 10, 26), // 26th November 2024 (Sunday)
        ];
        const matrix: CalendarEventCell[][] = weeks.map(() => []);

        (getWeekIndex as Mock).mockReturnValue(1);
        (getDay as Mock).mockReturnValue(3);

        categorizeDayEvent(event, weeks, matrix, weekStartDay);

        expect(matrix[1]).toHaveLength(1);
        expect(matrix[1][0]).toEqual({
            event,
            colStart: 4, // Wednesday + 1
            colEnd: 5, // Wednesday + 2
        });
    });

    it("should not categorize an event if week index is -1", () => {
        const event = {
            date: new Date(2024, 10, 30), // 30th November 2024
        } as DayEvent;

        (getWeekIndex as Mock).mockReturnValue(-1);

        categorizeDayEvent(event, weeks, matrix, weekStartDay);

        expect(matrix[1]).toHaveLength(1); // No change in matrix
    });
});
