import { useContext } from "react";
import { SettingsProviderContext } from "@/providers/SettingsProvider";

export function useSettings() {
    const value = useContext(SettingsProviderContext);

    if (value == null) {
        throw new Error("useSettings must be used within an SettingsProvider");
    }

    return value;
}
