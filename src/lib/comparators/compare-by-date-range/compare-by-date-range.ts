import { differenceInDays } from "date-fns";

type DateRange = {
    from: Date;
    to: Date;
};

export function compareByDateRange(a: DateRange, b: DateRange) {
    return differenceInDays(b.to, b.from) - differenceInDays(a.to, a.from);
}
