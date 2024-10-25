import { useState, useEffect } from "react";

type Calendar = {
    month: number;
    year: number;
    daysInMonth: number[];
    startDay: number;
    weekStart: number;
};

type CalendarWithHandlers = Calendar & {
    handleNextMonth: () => void;
    handlePreviousMonth: () => void;
    handleTodayClick: () => void;
};

function useCalendar() {
    const [month, setMonth] = useState<number>(new Date().getMonth());
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [daysInMonth, setDaysInMonth] = useState<number[]>([]);
    const [startDay, setStartDay] = useState<number>(0);
    const [weekStart, setWeekStart] = useState<number>(1);

    useEffect(() => {
        const getDaysInMonth = (month: number, year: number) => {
            const date = new Date(year, month, 1);
            const days = [];
            while (date.getMonth() === month) {
                days.push(new Date(date).getDate());
                date.setDate(date.getDate() + 1);
            }
            return days;
        };

        const getStartDay = (month: number, year: number) => {
            return new Date(year, month, 1).getDay();
        };

        setDaysInMonth(getDaysInMonth(month, year));
        setStartDay(getStartDay(month, year));
    }, [month, year]);

    function handleNextMonth() {
        if (month === 11) {
            setMonth(0);
            setYear(prevYear => prevYear + 1);
        } else {
            setMonth(prev => prev + 1);
        }
    }

    function handlePreviousMonth() {
        if (month === 0) {
            setMonth(11);
            setYear(year - 1);
        } else {
            setMonth(prev => prev - 1);
        }
    }

    function handleTodayClick() {
        setMonth(new Date().getMonth());
        setYear(new Date().getFullYear());
    }

    return {
        month,
        year,
        daysInMonth,
        startDay,
        weekStart,
        handleNextMonth,
        handlePreviousMonth,
        handleTodayClick,
    };
}

export { useCalendar, type Calendar, type CalendarWithHandlers };
