import { describe, it, expect } from "vitest";
import { categorizeFullDayEvent } from "./categorize-full-day-event";
import { WeekStartsOn } from "@/types";
import { FullDayEvent, CalendarEventCell } from "@/features/calendar";

describe("categorizeFullDayEvent()", () => {
    const mockEvent = {
        from: new Date(2023, 9, 1),
        to: new Date(2023, 9, 3),
        title: "Test Event",
    } as FullDayEvent;

    const weeks = [
        new Date(2023, 8, 25),
        new Date(2023, 9, 2),
        new Date(2023, 9, 9),
        new Date(2023, 9, 16),
        new Date(2023, 9, 23),
        new Date(2023, 9, 30),
    ];

    const selectedMonth = new Date(2023, 9, 1);
    const weekStartDay: WeekStartsOn = 0;

    it("should categorize event within the same week", () => {
        const matrix: CalendarEventCell[][] = [[], [], [], [], [], []];
        categorizeFullDayEvent(
            mockEvent,
            weeks,
            matrix,
            selectedMonth,
            weekStartDay
        );

        expect(matrix[1]).toHaveLength(1);
        expect(matrix[1][0].event).toEqual(mockEvent);
        expect(matrix[1][0].colStart).toBe(1);
        expect(matrix[1][0].colEnd).toBe(4);
    });

    it("should categorize event within the same week when week starts on Monday", () => {
        const mockEvent = {
            from: new Date(2023, 9, 3),
            to: new Date(2023, 9, 6),
            title: "Test Event",
        } as FullDayEvent;
        const weekStartDay: WeekStartsOn = 1;
        const matrix: CalendarEventCell[][] = [[], [], [], [], [], []];

        categorizeFullDayEvent(
            mockEvent,
            weeks,
            matrix,
            selectedMonth,
            weekStartDay
        );

        expect(matrix[1]).toHaveLength(1);
        expect(matrix[1][0].event).toEqual(mockEvent);
        expect(matrix[1][0].colStart).toBe(2);
        expect(matrix[1][0].colEnd).toBe(6);
    });

    it("should handle event spanning multiple weeks", () => {
        const multiWeekEvent = {
            from: new Date(2023, 9, 1),
            to: new Date(2023, 9, 10),
            title: "Multi-week Event",
        } as FullDayEvent;
        const matrix: CalendarEventCell[][] = [[], [], [], [], [], []];

        categorizeFullDayEvent(
            multiWeekEvent,
            weeks,
            matrix,
            selectedMonth,
            weekStartDay
        );

        expect(matrix[1]).toHaveLength(1);
        expect(matrix[2]).toHaveLength(1);
        expect(matrix[1][0].event).toEqual(multiWeekEvent);
        expect(matrix[2][0].event).toEqual(multiWeekEvent);
    });

    it("should handle event spanning multiple weeks when week starts on Monday", () => {
        const multiWeekEvent = {
            from: new Date(2023, 9, 1),
            to: new Date(2023, 9, 10),
            title: "Multi-week Event",
        } as FullDayEvent;
        const weekStartDay: WeekStartsOn = 1;
        const matrix: CalendarEventCell[][] = [[], [], [], [], [], []];

        categorizeFullDayEvent(
            multiWeekEvent,
            weeks,
            matrix,
            selectedMonth,
            weekStartDay
        );

        expect(matrix[1]).toHaveLength(1);
        expect(matrix[2]).toHaveLength(1);
        expect(matrix[1][0].event).toEqual(multiWeekEvent);
        expect(matrix[2][0].event).toEqual(multiWeekEvent);
    });

    it("should handle event outside the selected month", () => {
        const outsideMonthEvent = {
            from: new Date(2023, 8, 25),
            to: new Date(2023, 8, 30),
            title: "Outside Month Event",
        } as FullDayEvent;
        const matrix: CalendarEventCell[][] = [[], [], [], [], [], []];

        categorizeFullDayEvent(
            outsideMonthEvent,
            weeks,
            matrix,
            selectedMonth,
            weekStartDay
        );

        expect(matrix[0]).toHaveLength(1);
        expect(matrix[0][0].event).toEqual(outsideMonthEvent);
    });

    it("should handle event overlapping before the selected month", () => {
        const overlappingBeforeEvent = {
            from: new Date(2023, 8, 30),
            to: new Date(2023, 9, 2),
            title: "Overlapping Before Event",
        } as FullDayEvent;
        const matrix: CalendarEventCell[][] = [[], [], [], [], [], []];

        categorizeFullDayEvent(
            overlappingBeforeEvent,
            weeks,
            matrix,
            selectedMonth,
            weekStartDay
        );

        expect(matrix[0]).toHaveLength(1);
        expect(matrix[1]).toHaveLength(1);
        expect(matrix[0][0].event).toEqual(overlappingBeforeEvent);
        expect(matrix[1][0].event).toEqual(overlappingBeforeEvent);
    });

    it("should handle event overlapping after the selected month", () => {
        const overlappingAfterEvent = {
            from: new Date(2023, 9, 30),
            to: new Date(2023, 10, 2),
            title: "Overlapping After Event",
        } as FullDayEvent;
        const matrix: CalendarEventCell[][] = [[], [], [], [], [], []];

        categorizeFullDayEvent(
            overlappingAfterEvent,
            weeks,
            matrix,
            selectedMonth,
            weekStartDay
        );

        expect(matrix[5]).toHaveLength(1);
        expect(matrix[5][0].event).toEqual(overlappingAfterEvent);
    });

    it("should handle event within the selected month but ending after the last week", () => {
        const eventEndingAfterLastWeek = {
            from: new Date(2023, 9, 7),
            to: new Date(2023, 10, 25),
            title: "Event Ending After Last Week",
        } as FullDayEvent;
        const matrix: CalendarEventCell[][] = [[], [], [], [], [], []];
        categorizeFullDayEvent(
            eventEndingAfterLastWeek,
            weeks,
            matrix,
            selectedMonth,
            1
        );

        expect(matrix[4]).toHaveLength(1);
        expect(matrix[5]).toHaveLength(1);
        expect(matrix[4][0].event).toEqual(eventEndingAfterLastWeek);
        expect(matrix[5][0].event).toEqual(eventEndingAfterLastWeek);
    });
});
