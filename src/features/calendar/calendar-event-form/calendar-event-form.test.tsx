import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { z } from "zod";
import {
    vi,
    describe,
    it,
    expect,
    beforeEach,
    afterAll,
    type Mock,
} from "vitest";
import { useSettings } from "@/hooks/use-settings";
import { YEAR, MONTH } from "@/testConstants";
import * as lib from "@/lib";
import { CalendarEventForm, eventFormSchema } from "./calendar-event-form";

vi.mock("@/hooks/use-settings", () => ({
    useSettings: vi.fn(),
}));

vi.mock("@/lib", async () => {
    const originalModule = await vi.importActual<typeof lib>("@/lib");
    return {
        ...originalModule,
        formatLongDate: vi.fn(),
    };
});

const defaultFormValues: Partial<z.infer<typeof eventFormSchema>> = {
    title: "Test Event",
    description: "This is a test event",
    fullDay: false,
    color: "pink",
    date: new Date(YEAR, MONTH, 17),
    dateRange: {
        from: new Date(YEAR, MONTH, 17),
        to: new Date(YEAR, MONTH, 17),
    },
    startTime: "10:00",
    endTime: "11:00",
};

describe("CalendarEventForm Component", () => {
    beforeEach(() => {
        (useSettings as Mock).mockReturnValue({ weekStartDay: 0 });

        (lib.formatLongDate as Mock).mockImplementation(date => {
            return date.toLocaleDateString("en-US", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
            });
        });
    });

    afterAll(() => {
        vi.restoreAllMocks();
    });

    it("renders the form with default values", () => {
        render(
            <CalendarEventForm
                defaultFormValues={defaultFormValues}
                onSubmit={vi.fn()}
            />
        );

        const titleInputValue = screen
            .getByTestId("titleInput")
            .getAttribute("value");

        expect(titleInputValue).toBe(defaultFormValues.title);

        const fullDaySwitchState = screen
            .getByTestId("fullDaySwitch")
            .getAttribute("data-state");
        expect(fullDaySwitchState).toBe("unchecked");

        const dateButtonText = screen.getByTestId("dateButton").textContent;
        expect(dateButtonText).toBe(
            lib.formatLongDate(new Date(YEAR, MONTH, 17))
        );

        expect(screen.queryByTestId("dateRangeButton")).toBeNull();

        const startTimeText = screen.getByTestId("startTimeButton").textContent;
        expect(
            new RegExp(`${defaultFormValues.startTime}`).test(startTimeText!)
        ).toBe(true);

        const endTimeText = screen.getByTestId("endTimeButton").textContent;
        expect(
            new RegExp(`${defaultFormValues.endTime}`).test(endTimeText!)
        ).toBe(true);

        const descriptionInputText =
            screen.getByTestId("descriptionInput").textContent;

        expect(descriptionInputText).toBe(defaultFormValues.description);

        const colorRadios = screen.getAllByTestId("colorRadio");

        colorRadios.forEach(radio => {
            expect(radio.getAttribute("data-state")).toBe(
                radio.getAttribute("value") === defaultFormValues.color
                    ? "checked"
                    : "unchecked"
            );
        });
    });

    it("renders the form with fullDay switch checked", () => {
        render(
            <CalendarEventForm
                defaultFormValues={{ ...defaultFormValues, fullDay: true }}
                onSubmit={vi.fn()}
            />
        );

        const fullDaySwitchState = screen
            .getByTestId("fullDaySwitch")
            .getAttribute("data-state");
        expect(fullDaySwitchState).toBe("checked");

        expect(screen.queryByTestId("startTimeButton")).toBeNull();
        expect(screen.queryByTestId("endTimeButton")).toBeNull();

        const dateRangeButtonText =
            screen.getByTestId("dateRangeButton").textContent;

        const re = new RegExp(
            `${lib.formatLongDate(
                defaultFormValues.dateRange!.from
            )} - ${lib.formatLongDate(defaultFormValues.dateRange!.to)}`
        );
        expect(re.test(dateRangeButtonText!)).toBe(true);
    });

    it("calls onSubmit with form values when submitted", async () => {
        const handleSubmit = vi.fn();
        render(
            <CalendarEventForm
                defaultFormValues={defaultFormValues}
                onSubmit={handleSubmit}
            />
        );

        await userEvent.click(screen.getByTestId("saveFormButton"));
        expect(handleSubmit).toHaveBeenCalled();
    });

    it("calls onWatch with form values when they change", () => {
        const handleWatch = vi.fn();
        render(
            <CalendarEventForm
                defaultFormValues={defaultFormValues}
                onSubmit={vi.fn()}
                onWatch={handleWatch}
            />
        );

        fireEvent.change(screen.getByTestId("titleInput"), {
            target: { value: "Updated Event" },
        });

        expect(handleWatch).toHaveBeenCalledWith({
            ...defaultFormValues,
            title: "Updated Event",
            date: expect.any(Date),
            dateRange: {
                from: expect.any(Date),
                to: expect.any(Date),
            },
        });
    });
});
