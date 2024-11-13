import { useState, useRef, useLayoutEffect } from "react";
import {
    CalendarOverflowEvents,
    CalendarEventItem,
    type CalendarEventCell,
} from "@/features/calendar";
import { groupChildrenByColumn } from "@/features/calendar/utils";

type CalendarEventsListProps = {
    events: CalendarEventCell[];
    daysOfWeek: Date[];
    draftEvent: CalendarEventCell | undefined | null;
};

type OverflowEvent = {
    amount: number;
    colStart: number;
    colEnd: number;
};

function CalendarEventsList({
    events,
    daysOfWeek,
    draftEvent,
}: CalendarEventsListProps) {
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
            setOverflowEvents({});

            const children = getEventsChildren(containerElement);
            const draftEventElement =
                containerElement.querySelector<HTMLDivElement>(
                    "[data-draft-event-item]"
                );

            if (children.length === 0) {
                return;
            }

            resetChildrenDisplay(children);

            const remainingHeight = calculateRemainingHeight(
                containerElement,
                44
            );

            const childrenByCol = groupChildrenByColumn(children);

            Object.entries(childrenByCol).forEach(([col, children]) => {
                let totalHeight = draftEventElement?.clientHeight ?? 0;
                let amount = 0;

                children.forEach(child => {
                    const isOverflowing =
                        (totalHeight += child.clientHeight) > remainingHeight;
                    const isHidden = child.style.display === "none";

                    if (!(isOverflowing || isHidden)) {
                        return;
                    }

                    child.style.display = "none";
                    amount++;

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
    }, [events, draftEvent]);

    return (
        <div
            className="grid grid-cols-subgrid grid-flow-dense col-span-full auto-rows-min pt-8 gap-y-1 overflow-hidden"
            ref={containerRef}
        >
            {draftEvent && (
                <div className="grid grid-cols-subgrid col-span-full z-50">
                    <div
                        className="px-1.5"
                        data-draft-event-item
                        style={{
                            gridColumnStart: draftEvent.colStart,
                            gridColumnEnd: draftEvent.colEnd,
                        }}
                    >
                        <CalendarEventItem
                            className="shadow-md shadow-zinc-400/50 dark:shadow-none pointer-events-none"
                            event={draftEvent.event}
                        />
                    </div>
                </div>
            )}

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
                    <CalendarEventItem event={event} />
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
                        <CalendarOverflowEvents
                            amount={amount}
                            colStart={colStart}
                            colEnd={colEnd}
                            daysOfWeek={daysOfWeek}
                            events={events}
                        />
                    </div>
                )
            )}
        </div>
    );
}

export { CalendarEventsList };

function getEventsChildren(containerElement: Element): HTMLElement[] {
    return Array.from(
        containerElement.querySelectorAll<HTMLElement>("[data-event-item]")
    );
}

function resetChildrenDisplay(children: HTMLElement[]): void {
    children.forEach(child => {
        child.style.removeProperty("display");
    });
}

function calculateRemainingHeight(
    containerElement: Element,
    threshold = 0
): number {
    const c = getComputedStyle(containerElement);

    const computedStyleSum = [
        c.paddingBlockStart,
        c.paddingBlockEnd,
        c.borderBlockStartWidth,
        c.borderBlockEndWidth,
        c.rowGap,
    ].reduce((acc, cur) => {
        return acc + parseInt(cur);
    }, 0);

    return containerElement.clientHeight - computedStyleSum - threshold;
}
