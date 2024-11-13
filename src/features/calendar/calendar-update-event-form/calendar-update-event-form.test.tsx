// import { render, screen, fireEvent } from "@testing-library/react";
import { render, screen } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
// import { toast } from "sonner";
import {
    expect,
    describe,
    it,
    vi,
    beforeEach,
    afterAll,
    type Mock,
} from "vitest";
import {
    CalendarUpdateEventForm,
    Event,
    useEvents,
    EVENT_COLORS,
    DAY_EVENT,
    // FULL_DAY_EVENT,
} from "@/features/calendar";

vi.mock("@/features/calendar/hooks/use-events");
vi.mock("sonner");

const mockUpdateEvent = vi.fn();
// const mockOnUpdateEvent = vi.fn();

const event: Event = {
    id: crypto.randomUUID(),
    title: "Test Event",
    description: "Test Description",
    color: EVENT_COLORS[0],
    kind: DAY_EVENT,
    date: new Date(),
    startTime: new Date(),
    endTime: new Date(),
};

describe("CalendarUpdateEventForm Component", () => {
    beforeEach(() => {
        (useEvents as Mock).mockReturnValue({
            updateEvent: mockUpdateEvent,
        });
    });

    afterAll(() => {
        vi.restoreAllMocks();
    });

    it("renders the form with default values", () => {
        render(<CalendarUpdateEventForm event={event} />);

        expect(screen.getByDisplayValue("Test Event")).toBeDefined();
        expect(screen.getByDisplayValue("Test Description")).toBeDefined();
    });

    // TODO: Fix this test. When the test is running, zod internal utility function throws an error of undefined property.
    // it("calls updateEvent with correct values on submit", async () => {
    //     render(
    //         <CalendarUpdateEventForm
    //             event={event}
    //             onUpdateEvent={mockOnUpdateEvent}
    //         />
    //     );

    //     fireEvent.change(screen.getByDisplayValue("Test Event"), {
    //         target: { value: "Updated Event" },
    //     });
    //     fireEvent.change(screen.getByDisplayValue("Test Description"), {
    //         target: { value: "Updated Description" },
    //     });

    //     await userEvent.click(screen.getByTestId("saveFormButton"));

    //     expect(mockUpdateEvent).toHaveBeenCalledWith(
    //         expect.objectContaining({
    //             title: "Updated Event",
    //             description: "Updated Description",
    //         })
    //     );
    //     expect(mockOnUpdateEvent).toHaveBeenCalled();
    //     expect(toast).toHaveBeenCalledWith(
    //         "Událost byla aktualizována",
    //         expect.any(Object)
    //     );
    // });

    // it("calls updateEvent with full day event values on submit", async () => {
    //     const fullDayEvent: Event = {
    //         kind: FULL_DAY_EVENT,
    //         from: new Date(),
    //         to: new Date(),
    //         id: crypto.randomUUID(),
    //         title: "Test Event",
    //         description: "Test Description",
    //         color: EVENT_COLORS[0],
    //     };

    //     render(
    //         <CalendarUpdateEventForm
    //             event={fullDayEvent}
    //             onUpdateEvent={mockOnUpdateEvent}
    //         />
    //     );

    //     await userEvent.click(screen.getByTestId("saveFormButton"));

    //     expect(mockUpdateEvent).toHaveBeenCalledWith(
    //         expect.objectContaining({
    //             kind: FULL_DAY_EVENT,
    //             from: fullDayEvent.from,
    //             to: fullDayEvent.to,
    //         })
    //     );

    //     expect(mockOnUpdateEvent).toHaveBeenCalled();
    //     expect(toast).toHaveBeenCalledWith(
    //         "Událost byla aktualizována",
    //         expect.any(Object)
    //     );
    // });
});
