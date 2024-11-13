import { addHours } from "date-fns";
import { z } from "zod";
import { toast } from "sonner";
import { formatTime } from "@/lib";
import {
    roundToNearest15Minutes,
    parseTimeString,
} from "@/features/calendar/utils";
import {
    CalendarEventForm,
    eventFormSchema,
    useEvents,
    EVENT_COLORS,
    type Event,
} from "@/features/calendar";

type CalendarAddEventFormProps = {
    date: Date;
    onAddEvent?: () => void;
};

function CalendarAddEventForm({ date, onAddEvent }: CalendarAddEventFormProps) {
    const currentTime = new Date();
    const { addEvent, addDraftEvent, removeEvent, removeDraftEvent } =
        useEvents();

    const defaultFormValues: z.infer<typeof eventFormSchema> = {
        title: "",
        description: "",
        fullDay: false,
        color: EVENT_COLORS[0],
        date: date,
        dateRange: {
            from: date,
            to: date,
        },
        startTime: formatTime(roundToNearest15Minutes(currentTime)),
        endTime: formatTime(roundToNearest15Minutes(addHours(currentTime, 1))),
    };

    function handleWatch(values: z.infer<typeof eventFormSchema>) {
        const {
            title,
            fullDay,
            color,
            date,
            dateRange,
            description,
            endTime,
            startTime,
        } = values;

        const baseEvent = {
            description,
            color,
            title: title || "(bez názvu)",
        };

        if (fullDay) {
            addDraftEvent({
                ...baseEvent,
                kind: "FULL_DAY_EVENT",
                from: dateRange.from,
                to: dateRange.to,
            });
        } else {
            addDraftEvent({
                ...baseEvent,
                date,
                kind: "DAY_EVENT",
                startTime: parseTimeString(startTime),
                endTime: parseTimeString(endTime),
            });
        }
    }

    function handleSubmit(values: z.infer<typeof eventFormSchema>) {
        console.log("values", values);
        const {
            title,
            color,
            date,
            dateRange,
            description,
            endTime,
            fullDay,
            startTime,
        } = values;

        let eventId: Event["id"];
        const baseEvent = {
            title,
            description,
            color,
        };

        if (fullDay) {
            eventId = addEvent({
                ...baseEvent,
                kind: "FULL_DAY_EVENT",
                from: dateRange.from,
                to: dateRange.to,
            });
        } else {
            eventId = addEvent({
                ...baseEvent,
                date,
                kind: "DAY_EVENT",
                startTime: parseTimeString(startTime),
                endTime: parseTimeString(endTime),
            });
        }

        removeDraftEvent();
        onAddEvent?.();

        toast(`Událost byla vytvořena`, {
            action: {
                label: "Vrátit akci",
                onClick: () => removeEvent(eventId),
            },
        });
    }

    return (
        <div className="space-y-4" data-testid="addEventForm">
            <p className="text-lg font-semibold line-clamp-2">Přidat událost</p>
            <CalendarEventForm
                defaultFormValues={defaultFormValues}
                onSubmit={handleSubmit}
                onWatch={handleWatch}
            />
        </div>
    );
}

export { CalendarAddEventForm };
