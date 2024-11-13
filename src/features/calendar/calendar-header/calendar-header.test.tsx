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
import * as lib from "@/lib";
import { YEAR, MONTH } from "@/testing/constants";
import { CalendarHeader } from "@/features/calendar";

vi.mock("@/lib", async () => {
    const originalModule = await vi.importActual<typeof lib>("@/lib");
    return {
        ...originalModule,
        formatDate: vi.fn(),
    };
});

const mockDate = new Date(YEAR, MONTH, 1); // 1st Nov 2024
const mockOnNextMonthClick = vi.fn();
const mockOnPreviousMonthClick = vi.fn();
const mockOnTodayClick = vi.fn();

const setup = () => {
    render(
        <CalendarHeader
            date={mockDate}
            onNextMonthClick={mockOnNextMonthClick}
            onPreviousMonthClick={mockOnPreviousMonthClick}
            onTodayClick={mockOnTodayClick}
        />
    );
};

describe("CalendarHeader Component", () => {
    beforeEach(() => {
        (lib.formatDate as Mock).mockImplementation((date, options) => {
            return new Intl.DateTimeFormat("en-US", options).format(date);
        });
    });

    afterAll(() => {
        vi.restoreAllMocks();
    });

    it("renders the current month and year", () => {
        setup();
        expect(screen.getByText("November 2024")).toBeDefined();
    });

    it("calls onTodayClick when 'Dnes' button is clicked", () => {
        setup();
        fireEvent.click(screen.getByTestId("todayButton"));
        expect(mockOnTodayClick).toHaveBeenCalled();
    });

    it("calls onPreviousMonthClick when previous month button is clicked", () => {
        setup();
        fireEvent.click(screen.getByTestId("previousMonthButton"));
        expect(mockOnPreviousMonthClick).toHaveBeenCalled();
    });

    it("calls onNextMonthClick when next month button is clicked", () => {
        setup();
        fireEvent.click(screen.getByTestId("nextMonthButton"));
        expect(mockOnNextMonthClick).toHaveBeenCalled();
    });

    it("renders the ThemeToggle component", () => {
        setup();
        expect(screen.getByTestId("themeButton")).toBeDefined();
    });
});
