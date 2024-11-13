import { render, screen, fireEvent } from "@testing-library/react";
// import { toast } from "sonner";
// import userEvent from "@testing-library/user-event";
import {
    describe,
    it,
    vi,
    expect,
    beforeEach,
    afterAll,
    type Mock,
} from "vitest";
import {
    CalendarAddEventForm,
    useEvents,
    EVENT_COLORS,
    FULL_DAY_EVENT,
    DAY_EVENT,
} from "@/features/calendar";

vi.mock("@/features/calendar/hooks/use-events", () => ({
    useEvents: vi.fn(),
}));

vi.mock("sonner", () => ({
    toast: vi.fn(),
}));

const mockAddEvent = vi.fn();
const mockAddDraftEvent = vi.fn();
const mockRemoveEvent = vi.fn();
const mockRemoveDraftEvent = vi.fn();

describe("CalendarAddEventForm Component", () => {
    beforeEach(() => {
        (useEvents as Mock).mockReturnValue({
            addEvent: mockAddEvent,
            addDraftEvent: mockAddDraftEvent,
            removeEvent: mockRemoveEvent,
            removeDraftEvent: mockRemoveDraftEvent,
        });
    });

    afterAll(() => {
        vi.restoreAllMocks();
    });

    // TODO: Fix this test. When the test is running, zod internal utility function throws an error of undefined property.
    // it("calls handleSubmit and creates a full day event", async () => {
    //     const date = new Date();
    //     const onAddEvent = vi.fn();
    //     render(<CalendarAddEventForm date={date} onAddEvent={onAddEvent} />);

    //     fireEvent.change(screen.getByTestId("titleInput"), {
    //         target: { value: "Test Event" },
    //     });
    //     fireEvent.click(screen.getByTestId("fullDaySwitch"));
    //     await userEvent.click(screen.getByTestId("saveFormButton"));

    //     expect(mockAddEvent).toHaveBeenCalledWith({
    //         title: "Test Event",
    //         description: "",
    //         color: EVENT_COLORS[0],
    //         kind: FULL_DAY_EVENT,
    //         from: date,
    //         to: date,
    //     });
    //     expect(mockRemoveDraftEvent).toHaveBeenCalled();
    //     expect(onAddEvent).toHaveBeenCalled();
    //     expect(toast).toHaveBeenCalledWith("Událost byla vytvořena", {
    //         action: {
    //             label: "Vrátit akci",
    //             onClick: expect.any(Function),
    //         },
    //     });
    // });

    // it("calls handleSubmit and creates a day event", async () => {
    //     const date = new Date();
    //     const onAddEvent = vi.fn();
    //     render(<CalendarAddEventForm date={date} onAddEvent={onAddEvent} />);

    //     fireEvent.change(screen.getByTestId("titleInput"), {
    //         target: { value: "Test Event" },
    //     });
    //     await userEvent.click(screen.getByTestId("saveFormButton"));

    //     expect(mockAddEvent).toHaveBeenCalledWith({
    //         title: "Test Event",
    //         description: "",
    //         color: EVENT_COLORS[0],
    //         date: date,
    //         kind: DAY_EVENT,
    //         startTime: expect.any(Date),
    //         endTime: expect.any(Date),
    //     });
    //     expect(mockRemoveDraftEvent).toHaveBeenCalled();
    //     expect(onAddEvent).toHaveBeenCalled();
    //     expect(toast).toHaveBeenCalledWith("Událost byla vytvořena", {
    //         action: {
    //             label: "Vrátit akci",
    //             onClick: expect.any(Function),
    //         },
    //     });
    // });

    it("calls onWatch with form values when they change", () => {
        const date = new Date();
        render(<CalendarAddEventForm date={date} />);

        fireEvent.change(screen.getByTestId("titleInput"), {
            target: { value: "Updated Event" },
        });

        expect(mockAddDraftEvent).toHaveBeenCalledWith({
            title: "Updated Event",
            description: "",
            color: EVENT_COLORS[0],
            date: date,
            kind: DAY_EVENT,
            startTime: expect.any(Date),
            endTime: expect.any(Date),
        });

        fireEvent.click(screen.getByTestId("fullDaySwitch"));

        expect(mockAddDraftEvent).toHaveBeenCalledWith({
            title: "Updated Event",
            description: "",
            color: EVENT_COLORS[0],
            kind: FULL_DAY_EVENT,
            from: date,
            to: date,
        });
    });
});
