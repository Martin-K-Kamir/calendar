import { useContext } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ThemeProvider, ThemeProviderContext } from "@/features/theme";

describe("ThemeProvider", () => {
    const TestComponent = () => {
        const { theme, setTheme } = useContext(ThemeProviderContext);
        return (
            <div>
                <span data-testid="theme">{theme}</span>
                <button onClick={() => setTheme("dark")}>Set Dark Theme</button>
            </div>
        );
    };

    it("should provide the default theme", () => {
        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );
        expect(screen.getByTestId("theme").textContent).toBe("system");
    });

    it("should allow setting a new theme", async () => {
        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        await userEvent.click(screen.getByText("Set Dark Theme"));
        expect(screen.getByTestId("theme").textContent).toBe("dark");
    });

    it("should use the theme from localStorage if available", () => {
        localStorage.setItem("THEME", "light");
        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );
        expect(screen.getByTestId("theme").textContent).toBe("light");
        localStorage.removeItem("THEME");
    });

    it("should apply the correct class to the document root", async () => {
        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        await act(async () => {
            await userEvent.click(screen.getByText("Set Dark Theme"));
        });

        await waitFor(() => {
            expect(document.documentElement.classList.contains("dark")).toBe(
                true
            );
        });
    });
});
