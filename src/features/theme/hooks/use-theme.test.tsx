import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import {
    useTheme,
    ThemeProviderContext,
    type ThemeProviderState,
} from "@/features/theme";

describe("useTheme hook", () => {
    it("should return the theme context when used within ThemeProvider", () => {
        const mockContextValue: ThemeProviderState = {
            theme: "light",
            setTheme: vi.fn(),
        };

        const { result } = renderHook(() => useTheme(), {
            wrapper: ({ children }) => (
                <ThemeProviderContext.Provider value={mockContextValue}>
                    {children}
                </ThemeProviderContext.Provider>
            ),
        });

        expect(result.current).toBe(mockContextValue);
    });

    // Todo: find a way to test the error case
    // it("should throw an error if used outside of ThemeProvider", async () => {
    //     vi.spyOn(React, "useContext").mockReturnValue(null);

    //     const { result } = renderHook(() => useTheme());

    //     expect(result.error).toEqual(
    //         new Error("useTheme must be used within a ThemeProvider")
    //     );
    //     vi.restoreAllMocks();
    // });
});
