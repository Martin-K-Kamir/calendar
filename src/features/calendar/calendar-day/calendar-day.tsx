import { useState, useEffect } from "react";
import { isToday, isFirstDayOfMonth } from "date-fns";
import { X as XIcon } from "lucide-react";
import { cn, formatDate } from "@/lib";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
    PopoverClose,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarAddEventForm, useEvents } from "@/features/calendar";

type CalendarDayProps = {
    day: Date;
};

function CalendarDay({ day }: CalendarDayProps) {
    const { removeDraftEvent } = useEvents();
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    useEffect(() => {
        if (!isPopoverOpen) {
            removeDraftEvent();
        }
    }, [isPopoverOpen, removeDraftEvent]);

    return (
        <Popover
            modal={false}
            open={isPopoverOpen}
            onOpenChange={setIsPopoverOpen}
        >
            <PopoverTrigger asChild data-testid="popover-trigger">
                <div className="p-1.5 space-y-1.5">
                    <div
                        className={cn(
                            "justify-self-center text-xs px-[0.3em] py-[0.25em] min-w-5 text-center leading-none rounded font-semibold cursor-default",
                            isToday(day) &&
                                "text-white bg-blue-500 dark:bg-blue-700"
                        )}
                        data-testid={`day-${day.getDate()}-${day.getMonth()}`}
                    >
                        {formatDate(day, { day: "numeric" }).replace(/\./, "")}
                        {isFirstDayOfMonth(day) &&
                            ". " + formatDate(day, { month: "short" })}
                    </div>
                </div>
            </PopoverTrigger>

            <PopoverContent
                side="left"
                align="start"
                alignOffset={10}
                sideOffset={8}
                className="min-w-[22rem] w-auto"
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
                <CalendarAddEventForm
                    date={day}
                    onAddEvent={() => setIsPopoverOpen(false)}
                />
            </PopoverContent>
        </Popover>
    );
}

export { CalendarDay };
