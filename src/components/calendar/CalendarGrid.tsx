import { CalendarDay } from "./CalendarDay";
import { CalendarWeekDays } from "./CalendarWeekDays";
import { CalendarEvent } from "./CalendarEvent";
import { type CalendarEventCell } from "@/hooks/useCalendar";

type CalendarGridProps = {
    calendarDays: Date[];
    calendarEvents: CalendarEventCell[][];
};

function CalendarGrid({ calendarDays, calendarEvents }: CalendarGridProps) {
    return (
        <div className="h-full grid grid-rows-[auto,1fr] text-zinc-950 dark:text-zinc-200">
            {/* <div className="grid grid-cols-7 [&>div]:border-zinc-200 dark:[&>div]:border-zinc-800 [&>div]:border-t [&>div]:border-l [&>div:last-child]:border-r">
                <CalendarWeekDays />
            </div> */}
            <div className="relative h-full grid grid-cols-7 auto-rows-fr min-h-[40rem]">
                {/* <div className="grid grid-cols-subgrid row-span-full col-span-full [&>div]:border-zinc-200 dark:[&>div]:border-zinc-800 [&>div]:border-l [&>div:nth-child(n+8)]:border-t [&>div:nth-child(7n)]:border-r [&>div:nth-last-child(-n+7)]:border-b">
                    {calendarDays.map(day => (
                        <CalendarDay key={day.getTime()} day={day} />
                    ))}
                </div> */}
                <div className="grid grid-cols-subgrid auto-rows-fr	row-span-full col-span-full pointer-events-none">
                    {calendarEvents.map((row, rowIndex) => (
                        <div
                            key={rowIndex}
                            className="grid grid-cols-subgrid grid-flow-dense col-span-full auto-rows-min pt-8 gap-y-1 overflow-hidden b"
                        >
                            {row.map(
                                ({ event, colStart, colEnd }, itemIndex) => (
                                    <div
                                        key={itemIndex}
                                        className="px-1.5"
                                        style={{
                                            gridColumnStart: colStart,
                                            gridColumnEnd: colEnd,
                                        }}
                                    >
                                        <CalendarEvent {...event} />
                                    </div>
                                )
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export { CalendarGrid };
