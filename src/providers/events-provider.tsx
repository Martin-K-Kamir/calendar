import { createContext, useEffect, useState, useCallback } from "react";
import { UnionOmit } from "@/types";

export const FULL_DAY_EVENT = "FULL_DAY_EVENT";
export const DAY_EVENT = "DAY_EVENT";

export const EVENT_COLORS = [
    "pink",
    "indigo",
    "green",
    "blue",
    "red",
    "zinc",
] as const;

export type EventBase = {
    id: `${string}-${string}-${string}-${string}-${string}`;
    title: string;
    description: string;
    color: (typeof EVENT_COLORS)[number];
};

export type FullDayEvent = EventBase & {
    kind: typeof FULL_DAY_EVENT;
    from: Date;
    to: Date;
};

export type DayEvent = EventBase & {
    kind: typeof DAY_EVENT;
    startTime: Date;
    endTime: Date;
    date: Date;
};

export type Event = FullDayEvent | DayEvent;

export type EventsProviderProps = {
    children: React.ReactNode;
};

export type EventsContext = {
    events: Event[];
    draftEvent: Event | null;
    addEvent: (event: UnionOmit<Event, "id">) => Event["id"];
    addDraftEvent: (draftEvent: UnionOmit<Event, "id">) => void;
    removeEvent: (eventId: Event["id"]) => (event: Event) => void;
    removeDraftEvent: () => void;
    updateEvent: (updatedEvent: Event) => void;
};

export const EventsProviderContext = createContext<EventsContext | null>(null);

export function EventsProvider({ children }: EventsProviderProps) {
    const [events, setEvents] = useState<Event[]>(loadEventsFromLocalStorage);
    const [draftEvent, setDraftEvent] = useState<Event | null>(null);

    useEffect(() => {
        saveEventsToLocalStorage(events);
    }, [events]);

    const addEvent = useCallback((event: UnionOmit<Event, "id">) => {
        const id = crypto.randomUUID();

        setEvents(prevEvents => [
            ...prevEvents,
            {
                ...event,
                id,
            },
        ]);

        return id;
    }, []);

    const addDraftEvent = useCallback((draftEvent: UnionOmit<Event, "id">) => {
        setDraftEvent({
            ...draftEvent,
            id: crypto.randomUUID(),
        });
    }, []);

    const removeEvent = useCallback((eventId: Event["id"]) => {
        setEvents(prevEvents =>
            prevEvents.filter(event => event.id !== eventId)
        );

        return (event: Event) => {
            setEvents(prevEvents => [...prevEvents, event]);
        };
    }, []);

    const removeDraftEvent = useCallback(() => {
        setDraftEvent(null);
    }, []);

    const updateEvent = useCallback((updatedEvent: Event) => {
        setEvents(prevEvents =>
            prevEvents.map(event =>
                event.id === updatedEvent.id ? updatedEvent : event
            )
        );
    }, []);

    return (
        <EventsProviderContext.Provider
            value={{
                events,
                draftEvent,
                addEvent,
                addDraftEvent,
                removeEvent,
                removeDraftEvent,
                updateEvent,
            }}
        >
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
