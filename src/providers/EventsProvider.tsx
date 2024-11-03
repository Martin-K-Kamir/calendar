import { createContext, useEffect, useState, useCallback } from "react";

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
    draftEvent: Event | null;
    addFullDayEvent: (event: Omit<FullDayEvent, "id" | "kind">) => Event["id"];
    addDayEvent: (event: Omit<DayEvent, "id" | "kind">) => Event["id"];
    addDraftDayEvent: (draftEvent: Omit<DayEvent, "id" | "kind">) => void;
    addDraftFullDayEvent: (
        draftEvent: Omit<FullDayEvent, "id" | "kind">
    ) => void;
    removeEvent: (eventId: Event["id"]) => (event: Event) => void;
    removeDraftEvent: () => void;
};

const EventsProviderContext = createContext<EventsContext | null>(null);

function createEvent<T extends Event["kind"]>(
    kind: T,
    event: T extends "FULL_DAY_EVENT"
        ? Omit<FullDayEvent, "id" | "kind">
        : Omit<DayEvent, "id" | "kind">
): T extends "FULL_DAY_EVENT" ? FullDayEvent : DayEvent {
    const id = crypto.randomUUID();
    return { ...event, id, kind } as T extends "FULL_DAY_EVENT"
        ? FullDayEvent
        : DayEvent;
}

function EventsProvider({ children }: EventsProviderProps) {
    const [events, setEvents] = useState<Event[]>(loadEventsFromLocalStorage);
    const [draftEvent, setDraftEvent] = useState<Event | null>(null);

    useEffect(() => {
        saveEventsToLocalStorage(events);
    }, [events]);

    const addFullDayEvent = useCallback(
        (event: Omit<FullDayEvent, "id" | "kind">) => {
            const newEvent = createEvent("FULL_DAY_EVENT", event);

            setEvents(prevEvents => [...prevEvents, newEvent]);

            return newEvent.id;
        },
        []
    );

    const addDayEvent = useCallback((event: Omit<DayEvent, "id" | "kind">) => {
        const newEvent = createEvent("DAY_EVENT", event);

        setEvents(prevEvents => [...prevEvents, newEvent]);

        return newEvent.id;
    }, []);

    const addDraftDayEvent = useCallback(
        (draftEvent: Omit<DayEvent, "id" | "kind">) => {
            setDraftEvent(createEvent("DAY_EVENT", draftEvent));
        },
        []
    );

    const addDraftFullDayEvent = useCallback(
        (draftEvent: Omit<FullDayEvent, "id" | "kind">) => {
            setDraftEvent(createEvent("FULL_DAY_EVENT", draftEvent));
        },
        []
    );

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

    return (
        <EventsProviderContext.Provider
            value={{
                events,
                draftEvent,
                addFullDayEvent,
                addDayEvent,
                addDraftDayEvent,
                addDraftFullDayEvent,
                removeEvent,
                removeDraftEvent,
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

export {
    type Event,
    type DayEvent,
    type FullDayEvent,
    EventsProvider,
    EventsProviderContext,
    EVENT_COLORS,
};
