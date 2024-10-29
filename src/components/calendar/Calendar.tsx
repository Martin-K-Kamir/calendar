import { useCalendar } from "@/hooks/useCalendar";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarGrid } from "./CalendarGrid";

function Calendar() {
    const {
        selectedMonth,
        calendarDays,
        calendarEvents,
        handleNextMonth,
        handlePreviousMonth,
        handleToday,
    } = useCalendar();

    return (
        <div className="flex flex-col gap-8 h-full w-full max-w-[1920px] mx-auto">
            {/* <CalendarHeader
                date={selectedMonth}
                onNextMonthClick={handleNextMonth}
                onPreviousMonthClick={handlePreviousMonth}
                onTodayClick={handleToday}
            /> */}
            <CalendarGrid
                calendarDays={calendarDays}
                calendarEvents={calendarEvents}
            />
        </div>
    );
}

export { Calendar };
