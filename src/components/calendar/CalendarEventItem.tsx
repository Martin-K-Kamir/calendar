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
    type FullDayEvent,
} from "@/providers/EventsProvider";
import { formatTime } from "@/lib";

type CalendarEventItemProps = Event & {
    className?: string;
};

function CalendarEventItem({ kind, ...rest }: CalendarEventItemProps) {
    let content: React.ReactNode;
    if (kind === "FULL_DAY_EVENT") {
        content = <FullDayEventItem {...(rest as FullDayEvent)} />;
    } else if (kind === "DAY_EVENT") {
        content = <DayEventItem {...(rest as DayEvent)} />;
    } else {
        const exhaustiveCheck: never = kind;
        throw new Error(exhaustiveCheck);
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className="block w-full">{content}</button>
            </PopoverTrigger>
            <PopoverContent>Place content for the popover here.</PopoverContent>
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

export { CalendarEventItem };
