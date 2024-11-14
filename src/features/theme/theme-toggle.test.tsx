import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
    vi,
    describe,
    it,
    expect,
    beforeEach,
    afterAll,
    type Mock,
} from "vitest";
import { ThemeToggle, useTheme } from "@/features/theme";

vi.mock("@/features/theme/hooks/use-theme");

describe("ThemeToggle Component", () => {
    const setTheme = vi.fn();

    beforeEach(() => {
        (useTheme as Mock).mockReturnValue({
            setTheme,
            theme: "system",
        });
    });

    afterAll(() => {
        vi.restoreAllMocks();
    });

    it("renders correctly", () => {
        render(<ThemeToggle />);
        expect(screen.getByTestId("theme-button")).toBeDefined();
    });

    it("toggles theme to light", async () => {
        render(<ThemeToggle />);

        userEvent.click(screen.getByTestId("theme-button"));

        const lightButton = await screen.findByTestId("theme-button-light");

        fireEvent.click(lightButton);

        expect(setTheme).toHaveBeenCalledWith("light");
    });

    it("toggles theme to dark", async () => {
        render(<ThemeToggle />);

        userEvent.click(screen.getByTestId("theme-button"));

        const darkButton = await screen.findByTestId("theme-button-dark");

        fireEvent.click(darkButton);

        expect(setTheme).toHaveBeenCalledWith("dark");
    });

    it("toggles theme to system", async () => {
        render(<ThemeToggle />);

        userEvent.click(screen.getByTestId("theme-button"));

        const systemButton = await screen.findByTestId("theme-button-system");

        fireEvent.click(systemButton);

        expect(setTheme).toHaveBeenCalledWith("system");
    });
});
