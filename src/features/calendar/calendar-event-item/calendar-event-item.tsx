import { useState, useEffect } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
    X as XIcon,
    Trash2 as TrashIcon,
    Pencil as PencilIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { formatLongDate, formatTime, cn } from "@/lib";
import {
    CalendarUpdateEventForm,
    useEvents,
    type Event,
    type DayEvent,
    type FullDayEvent,
} from "@/features/calendar";

type CalendarEventItemProps = {
    className?: string;
    event: Event;
};

function CalendarEventItem({ event, className }: CalendarEventItemProps) {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const { removeEvent } = useEvents();

    const { title, description, color } = event || {};
    let eventItem: React.ReactNode;
    let time: string = "";

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        if (!isPopoverOpen) {
            timeoutId = setTimeout(() => {
                setIsEditing(false);
            }, 300);
        }

        return () => clearTimeout(timeoutId);
    }, [isPopoverOpen]);

    if (event.kind === "FULL_DAY_EVENT") {
        const { from, to } = event;

        time = `${formatLongDate(from)} - ${formatLongDate(to)}`;

        eventItem = <FullDayEventItem {...event} className={className} />;
    } else if (event.kind === "DAY_EVENT") {
        const { date, startTime, endTime } = event;

        time = `${formatLongDate(date)} ⋅ ${formatTime(
            startTime
        )} - ${formatTime(endTime)}`;

        eventItem = <DayEventItem {...event} className={className} />;
    } else {
        const exhaustiveCheck: never = event;
        throw new Error(`Unhandled event kind: ${exhaustiveCheck}`);
    }

    function handleRemoveEvent() {
        const revertRemoval = removeEvent(event.id);

        toast(`Událost byla odstraněna`, {
            action: {
                label: "Vrátit akci",
                onClick: () => revertRemoval(event),
            },
        });
    }

    function handleEditEvent() {
        setIsEditing(true);
    }

    function handleClose() {
        setIsPopoverOpen(false);
    }

    return (
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
                <button className="block w-full">{eventItem}</button>
            </PopoverTrigger>
            <PopoverContent
                side="bottom"
                align="start"
                sticky="always"
                className="w-[22rem] pb-4"
                data-testid="popoverContent"
            >
                <div className="flex justify-end gap-1.5 translate-x-2 -translate-y-2">
                    {!isEditing && (
                        <Button
                            size="icon"
                            variant="ghost"
                            className="size-6"
                            onClick={handleEditEvent}
                            data-testid="editEventButton"
                        >
                            <PencilIcon className="size-3.5" />
                        </Button>
                    )}
                    <Button
                        size="icon"
                        variant="ghost"
                        className="size-6"
                        onClick={handleRemoveEvent}
                        data-testid="removeEventButton"
                    >
                        <TrashIcon className="size-3.5" />
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="size-6"
                        onClick={handleClose}
                        data-testid="closePopoverButton"
                    >
                        <XIcon className="size-4" />
                    </Button>
                </div>

                {!isEditing && (
                    <EventItemPreview
                        title={title}
                        description={description}
                        time={time}
                        color={color}
                    />
                )}
                {isEditing && (
                    <CalendarUpdateEventForm
                        event={event}
                        onUpdateEvent={() => setIsPopoverOpen(false)}
                    />
                )}
            </PopoverContent>
        </Popover>
    );
}

const fullDayEventItemVariants = cva(
    "block truncate w-full px-2 py-[3px] rounded-md text-xs font-medium text-left text-white pointer-events-auto",
    {
        variants: {
            color: {
                pink: "bg-pink-600 hover:bg-pink-700 dark:bg-pink-700 dark:hover:bg-pink-800",
                blue: "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800",
                green: "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800",
                indigo: "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800",
                zinc: "bg-zinc-600 hover:bg-zinc-700 dark:bg-zinc-700 dark:hover:bg-zinc-800",
                red: "bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800",
            },
        },
    }
);

type FullDayEventItemProps = VariantProps<typeof fullDayEventItemVariants> &
    Omit<FullDayEvent, "kind"> & {
        className?: string;
    };

function FullDayEventItem({ color, title, className }: FullDayEventItemProps) {
    return (
        <span className={cn(fullDayEventItemVariants({ color, className }))}>
            {title}
        </span>
    );
}

const dayEventItemVariants = cva(
    "block truncate px-2 py-[3px] rounded-md text-xs w-full font-medium text-left bg-white text-zinc-900 hover:bg-zinc-100 dark:text-white dark:bg-zinc-950 dark:hover:bg-zinc-800 pointer-events-auto",
    {
        variants: {
            color: {
                pink: "[&>i]:bg-pink-600",
                blue: "[&>i]:bg-blue-600",
                green: "[&>i]:bg-green-600",
                indigo: "[&>i]:bg-indigo-600",
                zinc: "[&>i]:bg-zinc-600",
                red: "[&>i]:bg-red-600",
            },
        },
    }
);

type DayEventItemProps = VariantProps<typeof dayEventItemVariants> &
    Omit<DayEvent, "kind"> & {
        className?: string;
    };

function DayEventItem({
    color,
    startTime,
    title,
    className,
}: DayEventItemProps) {
    return (
        <span className={cn(dayEventItemVariants({ color, className }))}>
            <i className="size-2 inline-block rounded-full mr-1.5"></i>
            <span className="text-zinc-600 dark:text-zinc-400">
                {formatTime(startTime)}
            </span>
            <span className="font-normal">{" - "}</span>
            {title}
        </span>
    );
}

type EventItemPreviewProps = {
    title: string;
    description?: string;
    time: string;
    color: string;
};

function EventItemPreview({
    title,
    description,
    time,
    color,
}: EventItemPreviewProps) {
    return (
        <div data-testid="eventItemPreview">
            <div className="grid grid-cols-[min-content,auto] items-baseline gap-3">
                <span
                    className={`inline-block size-3.5 rounded bg-${color}-600 translate-y-px`}
                ></span>
                <p className="text-lg font-semibold line-clamp-2">{title}</p>
            </div>

            <div>
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mt-1.5">
                    {time}
                </p>
                {description && (
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-1.5">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}

export { CalendarEventItem };
