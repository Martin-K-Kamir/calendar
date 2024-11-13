import {
    useCalendar,
    CalendarHeader,
    CalendarDay,
    CalendarWeekDays,
    CalendarEventsList,
} from "@/features/calendar";

function Calendar() {
    const {
        selectedMonth,
        calendarDays,
        calendarWeeksWithDays,
        calendarEvents,
        calendarDraftEvent,
        handleNextMonth,
        handlePreviousMonth,
        handleToday,
    } = useCalendar();

    return (
        <div className="gap-8 h-full w-full max-w-[1920px] mx-auto">
            <div className="h-full grid grid-rows-[auto,auto,1fr] text-zinc-950 dark:text-zinc-200">
                <CalendarHeader
                    date={selectedMonth}
                    onNextMonthClick={handleNextMonth}
                    onPreviousMonthClick={handlePreviousMonth}
                    onTodayClick={handleToday}
                />

                <div className="grid grid-cols-7 [&>div]:border-zinc-200 dark:[&>div]:border-zinc-800 [&>div]:border-t [&>div]:border-l [&>div:last-child]:border-r mt-8">
                    <CalendarWeekDays />
                </div>

                <div className="grid grid-cols-7 auto-rows-fr min-h-0">
                    <div className="grid grid-cols-subgrid row-span-full col-span-full [&>div]:border-zinc-200 dark:[&>div]:border-zinc-800 [&>div]:border-l [&>div:nth-child(n+8)]:border-t [&>div:nth-child(7n)]:border-r [&>div:nth-last-child(-n+7)]:border-b">
                        {calendarDays.map(day => (
                            <CalendarDay key={day.getTime()} day={day} />
                        ))}
                    </div>

                    <div className="grid grid-cols-subgrid auto-rows-fr	row-span-full col-span-full pointer-events-none">
                        {calendarEvents.map((events, index) => (
                            <CalendarEventsList
                                key={index}
                                events={events}
                                draftEvent={calendarDraftEvent?.[index]}
                                daysOfWeek={calendarWeeksWithDays[index]}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export { Calendar };
