import { addHours } from "date-fns";
import { z } from "zod";
import { toast } from "sonner";
import { type Event, EVENT_COLORS } from "@/providers/events-provider";
import { useEvents } from "@/hooks/use-events";
import { formatTime } from "@/lib";
import {
    roundToNearest15Minutes,
    parseTimeString,
} from "@/features/calendar/utils";
import { CalendarEventForm, eventFormSchema } from "@/features/calendar";

type CalendarUpdateEventFormProps = {
    event: Event;
    onUpdateEvent?: () => void;
};

function CalendarUpdateEventForm({
    event,
    onUpdateEvent,
}: CalendarUpdateEventFormProps) {
    const { updateEvent } = useEvents();
    const currentTime = new Date();
    const isFullDayEvent = event.kind === "FULL_DAY_EVENT";

    const defaultFormValues: z.infer<typeof eventFormSchema> = {
        title: event.title,
        description: event.description,
        fullDay: isFullDayEvent,
        color: EVENT_COLORS[EVENT_COLORS.findIndex(c => c === event.color)],
        date: isFullDayEvent ? event.from : event.date,
        dateRange: {
            from: isFullDayEvent ? event.from : event.date,
            to: isFullDayEvent ? event.to : event.date,
        },
        startTime: isFullDayEvent
            ? formatTime(roundToNearest15Minutes(currentTime))
            : formatTime(event.startTime),
        endTime: isFullDayEvent
            ? formatTime(roundToNearest15Minutes(addHours(currentTime, 1)))
            : formatTime(event.endTime),
    };

    function handleSubmit(values: z.infer<typeof eventFormSchema>) {
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
            title,
            description,
            color,
            id: event.id,
        };

        if (fullDay) {
            updateEvent({
                ...baseEvent,
                kind: "FULL_DAY_EVENT",
                from: dateRange.from,
                to: dateRange.to,
            });
        } else {
            updateEvent({
                ...baseEvent,
                date,
                kind: "DAY_EVENT",
                startTime: parseTimeString(startTime),
                endTime: parseTimeString(endTime),
            });
        }

        onUpdateEvent?.();

        toast(`Událost byla aktualizována`, {
            action: {
                label: "Vrátit akci",
                onClick: () => updateEvent(event),
            },
        });
    }

    return (
        <div className="space-y-5" data-testid="updateEventForm">
            <p className="text-lg font-semibold">Upravit událost</p>
            <CalendarEventForm
                defaultFormValues={defaultFormValues}
                onSubmit={handleSubmit}
            />
        </div>
    );
}

export { CalendarUpdateEventForm };
