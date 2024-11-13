import { render, screen } from "@testing-library/react";
import { addDays, startOfWeek } from "date-fns";
import { useSettings } from "@/hooks/use-settings";
import { formatDate } from "@/lib";
import { describe, it, expect, vi, type Mock } from "vitest";
import { CalendarWeekDays } from "@/features/calendar";

vi.mock("@/hooks/use-settings");
vi.mock("@/lib");

const renderWeekDays = (weekStartDay: 0 | 1) => {
    (useSettings as Mock).mockReturnValue({ weekStartDay });

    const startDay = startOfWeek(new Date(), {
        weekStartsOn: weekStartDay,
    });
    const weekDays = Array.from({ length: 7 }).map((_, i) =>
        addDays(startDay, i)
    );

    (formatDate as Mock).mockImplementation((date, options) => {
        return new Intl.DateTimeFormat("en-US", options).format(date);
    });

    render(<CalendarWeekDays />);

    weekDays.forEach(date => {
        const weekDay = new Intl.DateTimeFormat("en-US", {
            weekday: "short",
        }).format(date);
        expect(screen.getByText(weekDay)).toBeDefined();
    });
};

describe("CalendarWeekDays Component", () => {
    it("should render the names of the days from Monday to Sunday", () => {
        renderWeekDays(1); // Monday
    });

    it("should render the names of the days from Sunday to Saturday", () => {
        renderWeekDays(0); // Sunday
    });
});
