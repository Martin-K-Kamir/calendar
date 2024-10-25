import { getWeekdayNames, cn } from "@/lib";
import { CalendarDay } from "./CalendarDay";
import { YearEvents } from "./Calendar";
import type { Calendar } from "@/hooks/useCalendar";

type CalendarGridProps = Pick<
    Calendar,
    "month" | "year" | "daysInMonth" | "startDay" | "weekStart"
> & {
    events: YearEvents;
};

function CalendarGrid({
    month,
    year,
    daysInMonth,
    startDay,
    weekStart,
    events,
}: CalendarGridProps) {
    const adjustedDaysOfWeek = getWeekdayNames(weekStart);
    const adjustedStartDay = (startDay - weekStart + 7) % 7;
    const totalDays = adjustedStartDay + daysInMonth.length;
    const totalCells = totalDays <= 35 ? 35 : 42;
    const emptyCellsBefore = Array.from({ length: adjustedStartDay });
    const emptyCellsAfter = Array.from({
        length: totalCells - (adjustedStartDay + daysInMonth.length),
    });

    const currentMonthEvents = events.get(year)?.get(month);
    return (
        <div className="h-full grid grid-rows-[auto,1fr] text-zinc-950 dark:text-zinc-200">
            <div className="grid grid-cols-7 [&>div]:border-zinc-300 dark:[&>div]:border-zinc-700 [&>div]:border-t [&>div]:border-l [&>div:last-child]:border-r">
                {adjustedDaysOfWeek.map(day => (
                    <div
                        key={day}
                        className="text-center text-xs font-semibold pt-1.5 px-1.5 uppercase text-zinc-500 dark:text-zinc-400"
                    >
                        {day}
                    </div>
                ))}
            </div>
            <div className="h-full grid grid-cols-7 auto-rows-fr min-h-[40rem] [&>div]:border-zinc-300 dark:[&>div]:border-zinc-700 [&>div]:border-l [&>div:nth-child(n+8)]:border-t [&>div:nth-child(7n)]:border-r [&>div:nth-last-child(-n+7)]:border-b">
                {emptyCellsBefore.map((_, index) => (
                    <div key={`empty-before-${index}`} className="p-1.5"></div>
                ))}
                {daysInMonth.map(day => (
                    <CalendarDay
                        key={`${day}${month}${year}`}
                        day={day}
                        month={month}
                        year={year}
                        events={currentMonthEvents?.get(day)}
                    />
                ))}
                {emptyCellsAfter.map((_, index) => (
                    <div key={`empty-after-${index}`} className="p-1.5"></div>
                ))}
            </div>
        </div>
    );
}

export { CalendarGrid };
