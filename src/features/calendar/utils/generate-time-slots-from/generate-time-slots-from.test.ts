import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { generateTimeSlotsFrom } from "@/features/calendar/utils";

describe("generateTimeSlotsFrom()", () => {
    // eslint-disable-next-line
    let spy: any;

    beforeEach(() => {
        const originalDateTimeFormat = Intl.DateTimeFormat;

        spy = vi
            .spyOn(Intl, "DateTimeFormat")
            .mockImplementation((_, options) => {
                return new originalDateTimeFormat("en-GB", {
                    ...options,
                });
            });
    });

    afterEach(() => {
        spy.mockRestore();
    });

    it("should generate time slots for a given date", () => {
        const from1 = new Date("2024-10-10T08:00:00");
        const result1 = generateTimeSlotsFrom(from1);
        expect(result1[0]).toEqual({ timeSlot: "08:00", duration: "0m" });
        expect(result1.length).toBe(64);

        const from2 = new Date("2024-10-10T13:00:00");
        const result2 = generateTimeSlotsFrom(from2);
        expect(result2[0]).toEqual({ timeSlot: "13:00", duration: "0m" });
        expect(result2.length).toBe(44);

        const from3 = new Date("2024-10-10T23:00:00");
        const result3 = generateTimeSlotsFrom(from3);
        expect(result3[0]).toEqual({ timeSlot: "23:00", duration: "0m" });
        expect(result3.length).toBe(4);
    });

    it("should handle edge cases at the end of the day", () => {
        const from = new Date("2024-10-10T23:45:00");
        const result = generateTimeSlotsFrom(from);

        expect(result).toEqual([{ timeSlot: "23:45", duration: "0m" }]);
    });

    it("should round up to the nearest 15 minutes", () => {
        const from = new Date("2024-10-10T08:07:00");
        const result = generateTimeSlotsFrom(from);

        expect(result[0].timeSlot).toBe("08:15");
    });

    it("should generate correct durations", () => {
        const from = new Date("2024-10-10T08:00:00");
        const result = generateTimeSlotsFrom(from);

        expect(result[4].duration).toBe("1h");
        expect(result[8].duration).toBe("2h");
    });
});
