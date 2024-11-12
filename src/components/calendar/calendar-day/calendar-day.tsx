import { useState, useEffect } from "react";
import { isToday, isFirstDayOfMonth } from "date-fns";
import { X as XIcon } from "lucide-react";
import { cn, formatDate } from "@/lib";
import { CalendarAddEventForm } from "../calendar-add-event-form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
    PopoverClose,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useEvents } from "@/hooks/use-events";

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
            <PopoverTrigger asChild data-testid="popoverTrigger">
                <div className="p-1.5 space-y-1.5">
                    <div
                        className={cn(
                            "justify-self-center text-xs px-[0.3em] py-[0.25em] min-w-5 text-center leading-none rounded font-semibold",
                            isToday(day) &&
                                "text-white bg-blue-500 dark:bg-blue-700"
                        )}
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
                data-testid="popoverContent"
            >
                <PopoverClose asChild>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="absolute right-2 top-2 size-6"
                        data-testid="closePopoverButton"
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
