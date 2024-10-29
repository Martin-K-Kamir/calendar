import { useContext } from "react";
import { EventsProviderContext } from "@/providers/EventsProvider";

export function useEvents() {
    const value = useContext(EventsProviderContext);

    if (value == null) {
        throw new Error("useEvents must be used within an EventsProvider");
    }

    return value;
}
