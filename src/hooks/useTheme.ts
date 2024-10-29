import { useContext } from "react";
import { ThemeProviderContext } from "@/providers/ThemeProvider";

export function useTheme() {
    const context = useContext(ThemeProviderContext);

    if (context == null)
        throw new Error("useTheme must be used within a ThemeProvider");

    return context;
}
