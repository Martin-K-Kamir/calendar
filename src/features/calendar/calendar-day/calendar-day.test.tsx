import { render, screen, fireEvent } from "@testing-library/react";
import {
    describe,
    it,
    expect,
    vi,
    beforeEach,
    afterAll,
    type Mock,
} from "vitest";
import { YEAR, MONTH } from "@/testing/constants";
import * as lib from "@/lib";
import { CalendarDay, useEvents } from "@/features/calendar";

vi.mock("@/lib", async () => {
    const originalModule = await vi.importActual<typeof lib>("@/lib");
    return {
        ...originalModule,
        formatDate: vi.fn(),
    };
});

vi.mock("@/features/calendar/hooks/use-events", () => ({
    useEvents: vi.fn(),
}));

const mockRemoveDraftEvent = vi.fn();
const mockAddDraftEvent = vi.fn();
const mockDate = new Date(YEAR, MONTH, 1); // 1st Nov 2024

describe("CalendarDay Component", () => {
    beforeEach(() => {
        (useEvents as Mock).mockReturnValue({
            removeDraftEvent: mockRemoveDraftEvent,
            addDraftEvent: mockAddDraftEvent,
        });
        (lib.formatDate as Mock).mockImplementation((date, options) => {
            return new Intl.DateTimeFormat("en-US", options).format(date);
        });
    });

    afterAll(() => {
        vi.restoreAllMocks();
    });

    it("renders the day correctly for the first day of the month", () => {
        render(<CalendarDay day={mockDate} />);
        expect(screen.getByText(/1\. Nov/i)).toBeDefined();
    });

    it("renders the day correctly for the rest of the month", () => {
        const mockDate = new Date(YEAR, MONTH, 15); // 15th Nov 2024
        render(<CalendarDay day={mockDate} />);
        expect(screen.getByText("15")).toBeDefined();
    });

    it("highlights today's date", () => {
        const today = new Date();
        render(<CalendarDay day={today} />);
        const element = screen.getByText(today.getDate().toString());

        const elementString = element.outerHTML;
        const regex = /text-white bg-blue-500 dark:bg-blue-700/;

        expect(regex.test(elementString)).toBe(true);
    });

    it("opens and closes the popover", () => {
        render(<CalendarDay day={mockDate} />);
        fireEvent.click(screen.getByTestId("popoverTrigger"));

        expect(screen.getByTestId("popoverContent")).toBeDefined();
        expect(screen.getByTestId("addEventForm")).toBeDefined();

        fireEvent.click(screen.getByTestId("closePopoverButton"));
        expect(screen.queryByTestId("popoverContent")).toBeNull();
    });

    it("calls addDraftEvent when popover opens", () => {
        render(<CalendarDay day={mockDate} />);
        fireEvent.click(screen.getByTestId("popoverTrigger"));

        expect(mockAddDraftEvent).toHaveBeenCalled();
    });

    it("calls removeDraftEvent when popover closes", () => {
        render(<CalendarDay day={mockDate} />);
        fireEvent.click(screen.getByTestId("popoverTrigger"));
        fireEvent.click(screen.getByTestId("closePopoverButton"));

        expect(mockRemoveDraftEvent).toHaveBeenCalled();
    });
});
