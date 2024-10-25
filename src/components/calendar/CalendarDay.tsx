import { cn } from "@/lib";
import type { Event } from "./Calendar";

type CalendarDayProps = {
    day: number;
    month: number;
    year: number;
    events?: Event[];
};

function CalendarDay({ day, month, year, events }: CalendarDayProps) {
    return (
        <div className="p-1.5">
            <div className="grid gap-1.5">
                <div
                    className={cn(
                        "grid place-content-center justify-self-center text-xs size-[20px] leading-none rounded-md font-semibold",
                        new Date(year, month, day).toDateString() ===
                            new Date().toDateString() &&
                            "text-white bg-blue-500 dark:bg-blue-700"
                    )}
                >
                    {day}
                </div>
                {/* <div className="space-y-1.5">
                    {events?.map(event => (
                        <div
                            key={event.id}
                            className={cn(
                                "flex items-center gap-1.5 px-1.5 py-1 rounded-md bg-pink-700"
                            )}
                        >
                            <div className="text-xs font-semibold text-white">
                                {event.title}
                            </div>
                        </div>
                    ))}
                </div> */}
                <div className="space-y-1.5">
                    {((day === 2 && month === 8) ||
                        (day === 8 && month === 8) ||
                        (day === 9 && month === 8) ||
                        (day === 15 && month === 8) ||
                        (day === 21 && month === 8) ||
                        (day === 1 && month === 9) ||
                        (day === 7 && month === 9) ||
                        (day === 12 && month === 9) ||
                        (day === 18 && month === 9) ||
                        (day === 22 && month === 9) ||
                        (day === 26 && month === 9) ||
                        (day === 26 && month === 11)) && (
                        <div className="flex items-center gap-1.5 px-1.5 py-1 rounded-md bg-pink-700">
                            <div className="text-xs font-semibold text-white">
                                Event 1
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export { CalendarDay };
