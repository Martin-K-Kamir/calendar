export const getWeekdayNames = (weekStart: number, locale?: string) => {
    const baseDate = new Date(Date.UTC(2021, 5, 20));
    const dayNames = [];
    for (let i = 0; i < 7; i++) {
        const day = new Date(baseDate);
        day.setUTCDate(baseDate.getUTCDate() + i);
        dayNames.push(
            new Intl.DateTimeFormat(locale, { weekday: "short" }).format(day)
        );
    }
    return [...dayNames.slice(weekStart), ...dayNames.slice(0, weekStart)];
};
