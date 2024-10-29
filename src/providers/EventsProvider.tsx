import { createContext, useEffect, useState, useCallback } from "react";
import { UnionOmit } from "@/types";

const EVENT_COLORS = [
    "pink",
    "indigo",
    "green",
    "blue",
    "red",
    "zinc",
] as const;

type EventBase = {
    id: `${string}-${string}-${string}-${string}-${string}`;
    title: string;
    description: string;
    color: (typeof EVENT_COLORS)[number];
};

type FullDayEvent = EventBase & {
    kind: "FULL_DAY_EVENT";
    from: Date;
    to: Date;
};

type DayEvent = EventBase & {
    kind: "DAY_EVENT";
    startTime: Date;
    endTime: Date;
    date: Date;
};

type Event = FullDayEvent | DayEvent;

type EventsProviderProps = {
    children: React.ReactNode;
};

type EventsContext = {
    events: Event[];
    addEvent: (event: Event) => void;
};

const EventsProviderContext = createContext<EventsContext | null>(null);

function EventsProvider({ children }: EventsProviderProps) {
    const [events, setEvents] = useState<Event[]>(loadEventsFromLocalStorage);

    useEffect(() => {
        saveEventsToLocalStorage(events);
    }, [events]);

    const addEvent = useCallback((event: UnionOmit<Event, "id">) => {
        setEvents(e => [...e, { ...event, id: crypto.randomUUID() }]);
    }, []);

    return (
        <EventsProviderContext.Provider value={{ events, addEvent }}>
            {children}
        </EventsProviderContext.Provider>
    );
}

function loadEventsFromLocalStorage() {
    const storedEvents = localStorage.getItem("EVENTS");
    if (!storedEvents) return [];

    const parsedEvents = JSON.parse(storedEvents, (key, value) => {
        if (["date", "startTime", "endTime", "from", "to"].includes(key))
            return new Date(value);
        return value;
    });

    return parsedEvents;
}

function saveEventsToLocalStorage(events: Event[]) {
    localStorage.setItem("EVENTS", JSON.stringify(events));
}

export {
    type Event,
    type DayEvent,
    type FullDayEvent,
    EventsProvider,
    EventsProviderContext,
    EVENT_COLORS,
};
