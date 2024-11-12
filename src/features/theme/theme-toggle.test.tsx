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
import { useTheme } from "./hooks";
import { ThemeToggle } from "./theme-toggle";

vi.mock("./hooks");

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
        expect(screen.getByTestId("themeButton")).toBeDefined();
    });

    it("toggles theme to light", async () => {
        render(<ThemeToggle />);

        userEvent.click(screen.getByTestId("themeButton"));

        const lightButton = await screen.findByTestId("themeButtonLight");

        fireEvent.click(lightButton);

        expect(setTheme).toHaveBeenCalledWith("light");
    });

    it("toggles theme to dark", async () => {
        render(<ThemeToggle />);

        userEvent.click(screen.getByTestId("themeButton"));

        const darkButton = await screen.findByTestId("themeButtonDark");

        fireEvent.click(darkButton);

        expect(setTheme).toHaveBeenCalledWith("dark");
    });

    it("toggles theme to system", async () => {
        render(<ThemeToggle />);

        userEvent.click(screen.getByTestId("themeButton"));

        const systemButton = await screen.findByTestId("themeButtonSystem");

        fireEvent.click(systemButton);

        expect(setTheme).toHaveBeenCalledWith("system");
    });
});
