import { CalendarHeader } from "./CalendarHeader";
import { CalendarGrid } from "./CalendarGrid";
import { useCalendar } from "@/hooks/useCalendar";

// Todo:
// create map to store day events and display them on the calendar
// make click event to add new event
// show some modal ui to add new event
// remove event
// update event
// if there is no room for event in the day cell hide it and show a counter of events

export type Event = {
    id: string;
    title: string;
    description: string;
    date: Date;
    startTime?: string;
    endTime?: string;
    isFullDay?: boolean;
    labelColor: "red" | "sky" | "green" | "amber" | "indigo" | "pink" | "zinc";
};

type DayEvents = Map<number, Event[]>;
type MonthEvents = Map<number, DayEvents>;
export type YearEvents = Map<number, MonthEvents>;

const mapOfDayEvents: DayEvents = new Map([
    [
        11,
        [
            {
                id: "1",
                title: "Event 1",
                description: "Event 1 description",
                date: new Date(2024, 9, 1),
                labelColor: "red",
            },
            {
                id: "2",
                title: "Event 2",
                description: "Event 2 description",
                date: new Date(2024, 9, 1),
                labelColor: "sky",
            },
        ],
    ],
    [
        12,
        [
            {
                id: "4",
                title: "Event 4",
                description: "Event 4 description",
                date: new Date(2024, 9, 2),
                labelColor: "red",
            },
        ],
    ],
    [
        16,
        [
            {
                id: "5",
                title: "Event 5",
                description: "Event 5 description",
                date: new Date(2024, 9, 2),
                labelColor: "pink",
            },
            {
                id: "6",
                title: "Event 6",
                description: "Event 6 description",
                date: new Date(2024, 9, 2),
                labelColor: "zinc",
            },
        ],
    ],
    [
        24,
        [
            {
                id: "3",
                title: "Event 3",
                description: "Event 3 description",
                date: new Date(2024, 9, 2),
                labelColor: "green",
            },
        ],
    ],
]);

const mapOfDayEvents2: DayEvents = new Map([
    [
        5,
        [
            {
                id: "2",
                title: "Event 2",
                description: "Event 2 description",
                date: new Date(2024, 8, 1),
                labelColor: "sky",
            },
        ],
    ],
    [
        7,
        [
            {
                id: "4",
                title: "Event 4",
                description: "Event 4 description",
                date: new Date(2024, 8, 2),
                labelColor: "red",
            },
        ],
    ],
    [
        18,
        [
            {
                id: "5",
                title: "Event 5",
                description: "Event 5 description",
                date: new Date(2024, 8, 2),
                labelColor: "pink",
            },
        ],
    ],
    [
        26,
        [
            {
                id: "3",
                title: "Event 3",
                description: "Event 3 description",
                date: new Date(2024, 8, 2),
                labelColor: "green",
            },
        ],
    ],
]);

const mapOfMonthEvents: MonthEvents = new Map([
    [9, mapOfDayEvents],
    [8, mapOfDayEvents2],
]);

const events: YearEvents = new Map([[2024, mapOfMonthEvents]]);

function Calendar() {
    const {
        month,
        year,
        daysInMonth,
        startDay,
        weekStart,
        handleNextMonth,
        handlePreviousMonth,
        handleTodayClick,
    } = useCalendar();

    return (
        <div className="flex flex-col gap-8 h-full w-full max-w-[1920px] mx-auto">
            <CalendarHeader
                month={month}
                year={year}
                onNextMonth={handleNextMonth}
                onPreviousMonth={handlePreviousMonth}
                onTodayClick={handleTodayClick}
            />
            <CalendarGrid
                month={month}
                year={year}
                daysInMonth={daysInMonth}
                startDay={startDay}
                weekStart={weekStart}
                events={events}
            />
        </div>
    );
}

export { Calendar };
