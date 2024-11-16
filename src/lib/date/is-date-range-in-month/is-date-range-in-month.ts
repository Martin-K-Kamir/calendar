import { endOfMonth, startOfMonth, isWithinInterval } from "date-fns";

export function isDateRangeInMonth(
    from: Date,
    to: Date,
    selectedMonth: Date
): boolean {
    const startOfSelectedMonth = startOfMonth(selectedMonth);
    const endOfSelectedMonth = endOfMonth(selectedMonth);

    return (
        isWithinInterval(from, {
            start: startOfSelectedMonth,
            end: endOfSelectedMonth,
        }) ||
        isWithinInterval(to, {
            start: startOfSelectedMonth,
            end: endOfSelectedMonth,
        }) ||
        (from < startOfSelectedMonth && to > endOfSelectedMonth)
    );
}
