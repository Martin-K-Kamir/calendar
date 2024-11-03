import { useState, useEffect } from "react";
import { isToday, isFirstDayOfMonth } from "date-fns";
import { X as XIcon } from "lucide-react";
import { cn, formatDate } from "@/lib";
import { CalendarAddEvent } from "./CalendarAddEvent";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
    PopoverClose,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useEvents } from "@/hooks/useEvents";

type CalendarDayProps = {
    day: Date;
};

function CalendarDay({ day }: CalendarDayProps) {
    const { removeDraftEvent } = useEvents();
    const [popoverOpen, setPopoverOpen] = useState(false);

    useEffect(() => {
        if (!popoverOpen) {
            removeDraftEvent();
        }
    }, [popoverOpen]);

    return (
        <Popover modal={false} open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
                <div className="p-1.5 space-y-1.5">
                    <div
                        className={cn(
                            "justify-self-center text-xs px-[0.3em] py-[0.25em] min-w-5 text-center leading-none rounded-md font-semibold",
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
                className="w-[22rem]"
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
                <CalendarAddEvent
                    day={day}
                    onAddEvent={() => setPopoverOpen(false)}
                />
            </PopoverContent>
        </Popover>
    );
}

export { CalendarDay };
