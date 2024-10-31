import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    type Event,
    type DayEvent,
    FullDayEvent,
} from "@/providers/EventsProvider";
import { formatTime } from "@/lib";

type CalendarEventProps = Event;

function CalendarEvent({ kind, ...rest }: CalendarEventProps) {
    let content: React.ReactNode;
    if (kind === "FULL_DAY_EVENT") {
        content = <CalendarFullDayEvent {...(rest as FullDayEvent)} />;
    } else if (kind === "DAY_EVENT") {
        content = <CalendarDayEvent {...(rest as DayEvent)} />;
    } else {
        const exhaustiveCheck: never = kind;
        throw new Error(exhaustiveCheck);
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className="block w-full pointer-events-auto">
                    {content}
                </button>
            </PopoverTrigger>
            <PopoverContent>Place content for the popover here.</PopoverContent>
        </Popover>
    );
}

const calendarFullDayEventVariants = cva(
    "px-2 py-[3px] rounded-md text-xs font-medium text-left text-white",
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

type CalendarFullDayEventProps = VariantProps<
    typeof calendarFullDayEventVariants
> &
    Omit<FullDayEvent, "kind">;

function CalendarFullDayEvent({
    color,
    description,
    from,
    to,
    id,
    title,
}: CalendarFullDayEventProps) {
    return (
        <div className={cn(calendarFullDayEventVariants({ color }))}>
            {title}
        </div>
    );
}

const calendarDayEventVariants = cva(
    "px-2 py-[3px] rounded-md text-xs w-full font-medium text-left bg-white text-zinc-900 hover:bg-zinc-100 dark:text-white dark:bg-zinc-950 dark:hover:bg-zinc-800",
    {
        variants: {
            color: {
                pink: "[&>span]:bg-pink-600",
                blue: "[&>span]:bg-blue-600",
                green: "[&>span]:bg-green-600",
                indigo: "[&>span]:bg-indigo-600",
                zinc: "[&>span]:bg-zinc-600",
                red: "[&>span]:bg-red-600",
            },
        },
    }
);

type CalendarDayEventProps = VariantProps<typeof calendarDayEventVariants> &
    Omit<DayEvent, "kind">;

function CalendarDayEvent({
    color,
    date,
    description,
    endTime,
    id,
    startTime,
    title,
}: CalendarDayEventProps) {
    return (
        <div className={cn(calendarDayEventVariants({ color }))}>
            {/* <span className="size-2 inline-block rounded-full mr-1.5"></span> */}
            <p className="inline-block truncate text-ellipsis">
                {/* <span className="text-zinc-600 dark:text-zinc-400">
                    {formatTime(startTime)}
                </span>
                <span className="font-normal">{" - "}</span> */}
                <span className="truncate">{title}</span>
            </p>
        </div>
    );
}

export { CalendarEvent };
