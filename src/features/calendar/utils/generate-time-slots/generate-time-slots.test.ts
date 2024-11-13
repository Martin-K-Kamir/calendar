import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { generateTimeSlots } from "@/features/calendar/utils";

describe("generateTimeSlots()", () => {
    // eslint-disable-next-line
    let spy: any;

    beforeEach(() => {
        const originalDateTimeFormat = Intl.DateTimeFormat;

        spy = vi
            .spyOn(Intl, "DateTimeFormat")
            .mockImplementation((_, options) => {
                return new originalDateTimeFormat("en-US", {
                    ...options,
                    hour12: true,
                });
            });
    });

    afterEach(() => {
        spy.mockRestore();
    });

    it("should generate 96 time slots", () => {
        const timeSlots = generateTimeSlots();
        expect(timeSlots.length).toBe(96);
    });

    it("should start at 12:00 AM", () => {
        const timeSlots = generateTimeSlots();
        expect(timeSlots[0]).toBe("12:00 AM");
    });

    it("should end at 11:45 PM", () => {
        const timeSlots = generateTimeSlots();
        expect(timeSlots[95]).toBe("11:45 PM");
    });

    it("should increment by 15 minutes", () => {
        const timeSlots = generateTimeSlots();
        expect(timeSlots[1]).toBe("12:15 AM");
        expect(timeSlots[2]).toBe("12:30 AM");
        expect(timeSlots[3]).toBe("12:45 AM");
        expect(timeSlots[4]).toBe("01:00 AM");
    });
});
