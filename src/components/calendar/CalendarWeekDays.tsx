import { useMemo } from "react";
import { addDays, startOfWeek } from "date-fns";
import { formatDate } from "@/lib";
import { useSettings } from "@/hooks/useSettings";

type CalendarWeekDayProps = {
    date: Date;
};

function CalendarWeekDay({ date }: CalendarWeekDayProps) {
    return (
        <div
            className="text-center text-xs font-semibold pt-1.5 px-1.5  text-zinc-500 dark:text-zinc-400"
            aria-label={formatDate(date, { weekday: "long" })}
        >
            {formatDate(date, { weekday: "short" })}
        </div>
    );
}

function CalendarWeekDays() {
    const { weekStartDay } = useSettings();

    const weekDays = useMemo(() => {
        const start = startOfWeek(new Date(), { weekStartsOn: weekStartDay });
        return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
    }, [weekStartDay]);

    return (
        <>
            {weekDays.map((date, i) => (
                <CalendarWeekDay key={i} date={date} />
            ))}
        </>
    );
}

export { CalendarWeekDays };
