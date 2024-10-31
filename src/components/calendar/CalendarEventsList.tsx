import { useState, useRef, useLayoutEffect } from "react";
import { X as XIcon } from "lucide-react";
import { type CalendarEventCell } from "@/hooks/useCalendar";
import { CalendarEvent } from "./CalendarEvent";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
    PopoverClose,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatLongDate } from "@/lib";
import { Button } from "@/components/ui/button";

type CalendarEventsListProps = {
    events: CalendarEventCell[];
    daysOfWeek: Date[];
};

type OverflowEvent = {
    amount: number;
    colStart: number;
    colEnd: number;
};

function calculateSize(...args: string[]) {
    return args.reduce((acc, cur) => {
        return acc + parseInt(cur);
    }, 0);
}

function CalendarEventsList({ events, daysOfWeek }: CalendarEventsListProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [overflowEvents, setOverflowEvents] = useState<
        Record<number, OverflowEvent>
    >({});

    useLayoutEffect(() => {
        if (containerRef.current == null) {
            return;
        }

        const observer = new ResizeObserver(entries => {
            const containerElement = entries[0]?.target;

            if (containerElement == null) {
                return;
            }

            const children =
                containerElement.querySelectorAll<HTMLElement>(
                    "[data-event-item]"
                );

            children.forEach(child => {
                child.style.removeProperty("display");
            });

            setOverflowEvents({});

            if (children.length === 0) {
                return;
            }

            const c = getComputedStyle(containerElement);

            const remainingHeight =
                containerElement.clientHeight -
                44 -
                calculateSize(
                    c.paddingBlockStart,
                    c.paddingBlockEnd,
                    c.borderBlockStartWidth,
                    c.borderBlockEndWidth,
                    c.rowGap
                );

            const childrenByCol = Array.from(children).reduce((acc, child) => {
                const colStart = parseInt(child.style.gridColumnStart);
                const colEnd = parseInt(child.style.gridColumnEnd);

                for (let i = colStart; i < colEnd; i++) {
                    acc[i] = [...(acc[i] ?? []), child];
                }

                return acc;
            }, {} as Record<string, HTMLElement[]>);

            Object.entries(childrenByCol).forEach(([col, children]) => {
                let totalHeight = 0;
                let amount = 0;

                children.forEach(child => {
                    const isOverflowing =
                        (totalHeight += child.clientHeight) > remainingHeight;
                    const isHidden = child.style.display === "none";
                    amount++;

                    if (!(isOverflowing || isHidden)) {
                        return;
                    }
                    child.style.display = "none";

                    setOverflowEvents(prev => ({
                        ...prev,
                        [parseInt(col)]: {
                            amount,
                            colStart: parseInt(col),
                            colEnd: parseInt(col) + 1,
                        },
                    }));
                });
            });
        });

        observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, [events]);

    return (
        <div
            className="grid grid-cols-subgrid grid-flow-dense col-span-full auto-rows-min pt-8 gap-y-1 overflow-hidden"
            ref={containerRef}
        >
            {events.map(({ event, colStart, colEnd }) => (
                <div
                    key={event.id}
                    className="px-1.5"
                    data-event-item
                    style={{
                        gridColumnStart: colStart,
                        gridColumnEnd: colEnd,
                    }}
                >
                    <CalendarEvent {...event} />
                </div>
            ))}
            {Object.entries(overflowEvents).map(
                ([key, { amount, colStart, colEnd }]) => (
                    <div
                        key={key}
                        className="px-1.5"
                        style={{
                            gridColumnStart: colStart,
                            gridColumnEnd: colEnd,
                        }}
                    >
                        <Popover>
                            <PopoverTrigger asChild>
                                <button className="block w-full pointer-events-auto px-2 py-[3px] rounded-md text-xs font-semibold text-left bg-white text-zinc-900 hover:bg-zinc-100 dark:text-white dark:bg-zinc-950 dark:hover:bg-zinc-800">
                                    {amount} more
                                </button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-64 h-auto"
                                align="center"
                                side="top"
                            >
                                <PopoverClose asChild>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="absolute right-2 top-2 size-6"
                                    >
                                        <XIcon className="size-4" />
                                    </Button>
                                </PopoverClose>
                                <p className="pb-4">
                                    {formatLongDate(daysOfWeek[colStart - 1])}
                                </p>
                                <ScrollArea>
                                    <div className="space-y-1.5 pr-4 max-h-72">
                                        {events
                                            .filter(event => {
                                                return (
                                                    event.colStart <=
                                                        colStart &&
                                                    event.colEnd >= colEnd
                                                );
                                            })
                                            .map(({ event }) => (
                                                <CalendarEvent
                                                    key={event.id}
                                                    {...event}
                                                />
                                            ))}
                                    </div>
                                </ScrollArea>
                            </PopoverContent>
                        </Popover>
                    </div>
                )
            )}
        </div>
    );
}

export { CalendarEventsList };
