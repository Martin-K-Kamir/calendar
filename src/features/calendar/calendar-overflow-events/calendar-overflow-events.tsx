import { X as XIcon } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
    PopoverClose,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { formatLongDate } from "@/lib";
import { CalendarEventItem, type CalendarEventCell } from "@/features/calendar";

export type CalendarOverflowEventsProps = {
    amount: number;
    colStart: number;
    colEnd: number;
    daysOfWeek: Date[];
    events: CalendarEventCell[];
};

function CalendarOverflowEvents({
    amount,
    colStart,
    colEnd,
    daysOfWeek,
    events,
}: CalendarOverflowEventsProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    className="block w-full pointer-events-auto px-2 py-[3px] rounded-md text-xs font-semibold text-left bg-white text-zinc-900 hover:bg-zinc-100 dark:text-white dark:bg-zinc-950 dark:hover:bg-zinc-800"
                    data-testid="popover-trigger"
                >
                    {amount} další
                </button>
            </PopoverTrigger>
            <PopoverContent
                className="w-64 h-auto"
                align="center"
                side="top"
                data-testid="popover-content"
            >
                <PopoverClose asChild>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="absolute right-2 top-2 size-6"
                        data-testid="popover-close-button"
                    >
                        <XIcon className="size-4" />
                    </Button>
                </PopoverClose>
                <p className="pb-4 text-md font-semibold">
                    {formatLongDate(daysOfWeek[colStart - 1])}
                </p>
                <ScrollArea>
                    <div className="space-y-1.5 pr-4 max-h-72">
                        {events
                            .filter(event => {
                                return (
                                    event.colStart <= colStart &&
                                    event.colEnd >= colEnd
                                );
                            })
                            .map(({ event }) => (
                                <CalendarEventItem
                                    key={event.id}
                                    event={event}
                                />
                            ))}
                    </div>
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}

export { CalendarOverflowEvents };
