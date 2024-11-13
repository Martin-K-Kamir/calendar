import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useEvents, EventsProviderContext } from "@/features/calendar";

describe("useEvents hook", () => {
    // Todo: find a way to test the error case
    // it("should throw an error if used outside of EventsProvider", () => {
    //     const { result } = renderHook(() => useEvents());

    //     expect(result.error).toEqual(
    //         new Error("useEvents must be used within an EventsProvider")
    //     );
    // });

    it("should return context value if used within EventsProvider", () => {
        const mockContextValue = {
            events: [],
            draftEvent: null,
            addEvent: vi.fn(),
            addDraftEvent: vi.fn(),
            updateEvent: vi.fn(),
            deleteEvent: vi.fn(),
            removeEvent: vi.fn(),
            removeDraftEvent: vi.fn(),
        };

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <EventsProviderContext.Provider value={mockContextValue}>
                {children}
            </EventsProviderContext.Provider>
        );

        const { result } = renderHook(() => useEvents(), { wrapper });

        expect(result.current).toBe(mockContextValue);
    });
});
