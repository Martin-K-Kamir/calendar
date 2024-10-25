import { capitalize } from "./capitalize";

export const getMonthNames = (locale?: string) => {
    const baseDate = new Date(Date.UTC(2021, 0, 1));
    const monthNames = [];
    for (let i = 0; i < 12; i++) {
        const month = new Date(baseDate);
        month.setUTCMonth(i);
        monthNames.push(
            capitalize(
                new Intl.DateTimeFormat(locale, { month: "long" }).format(month)
            )
        );
    }
    return monthNames;
};
