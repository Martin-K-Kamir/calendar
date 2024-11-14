import { render, screen, fireEvent } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
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
import { YEAR, MONTH } from "@/testing/constants";
import * as lib from "@/lib";
import { CalendarEventForm, eventFormSchema } from "@/features/calendar";

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
            .getByTestId("title-input")
            .getAttribute("value");

        expect(titleInputValue).toBe(defaultFormValues.title);

        const fullDaySwitchState = screen
            .getByTestId("full-day-switch")
            .getAttribute("data-state");
        expect(fullDaySwitchState).toBe("unchecked");

        const dateButtonText = screen.getByTestId("date-button").textContent;
        expect(dateButtonText).toBe(
            lib.formatLongDate(new Date(YEAR, MONTH, 17))
        );

        expect(screen.queryByTestId("date-range-button")).toBeNull();

        const startTimeText =
            screen.getByTestId("start-time-button").textContent;
        expect(
            new RegExp(`${defaultFormValues.startTime}`).test(startTimeText!)
        ).toBe(true);

        const endTimeText = screen.getByTestId("end-time-button").textContent;
        expect(
            new RegExp(`${defaultFormValues.endTime}`).test(endTimeText!)
        ).toBe(true);

        const descriptionInputText =
            screen.getByTestId("description-input").textContent;

        expect(descriptionInputText).toBe(defaultFormValues.description);

        const colorRadios = screen.getAllByTestId("radio-color");

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
            .getByTestId("full-day-switch")
            .getAttribute("data-state");
        expect(fullDaySwitchState).toBe("checked");

        expect(screen.queryByTestId("start-time-button")).toBeNull();
        expect(screen.queryByTestId("end-time-button")).toBeNull();

        const dateRangeButtonText =
            screen.getByTestId("date-range-button").textContent;

        const re = new RegExp(
            `${lib.formatLongDate(
                defaultFormValues.dateRange!.from
            )} - ${lib.formatLongDate(defaultFormValues.dateRange!.to)}`
        );
        expect(re.test(dateRangeButtonText!)).toBe(true);
    });

    it("sets endTime to 11:45 PM if startTime is 11:00 PM or later", () => {
        const originalDateTimeFormat = Intl.DateTimeFormat;

        Intl.DateTimeFormat = vi.fn((_, options) => {
            return new originalDateTimeFormat("en-US", options);
        }) as unknown as typeof Intl.DateTimeFormat;

        Intl.DateTimeFormat.supportedLocalesOf =
            originalDateTimeFormat.supportedLocalesOf;

        render(
            <CalendarEventForm
                defaultFormValues={{
                    ...defaultFormValues,
                    startTime: "11:00 PM",
                }}
                onSubmit={vi.fn()}
            />
        );

        fireEvent.click(screen.getByTestId("start-time-button"));
        fireEvent.click(screen.getByTestId("start-time-option-11:00 PM"));

        const endTimeText = screen.getByTestId("end-time-button").textContent!;
        expect(/11:45 PM/.test(endTimeText)).toBe(true);

        Intl.DateTimeFormat = originalDateTimeFormat;
    });

    // TODO: Fix this test. When the test is running, zod internal utility function throws an error of undefined property.
    // it("calls onSubmit with form values when submitted", async () => {
    //     const handleSubmit = vi.fn();
    //     render(
    //         <CalendarEventForm
    //             defaultFormValues={defaultFormValues}
    //             onSubmit={handleSubmit}
    //         />
    //     );

    //     await userEvent.click(screen.getByTestId("save-form-button"));
    //     expect(handleSubmit).toHaveBeenCalled();
    // });

    it("calls onWatch with form values when they change", () => {
        const handleWatch = vi.fn();
        render(
            <CalendarEventForm
                defaultFormValues={defaultFormValues}
                onSubmit={vi.fn()}
                onWatch={handleWatch}
            />
        );

        fireEvent.change(screen.getByTestId("title-input"), {
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
