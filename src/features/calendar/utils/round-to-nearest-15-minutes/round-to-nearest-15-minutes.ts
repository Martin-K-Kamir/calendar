import { addMinutes } from "date-fns";

export function roundToNearest15Minutes(date: Date) {
    const minutes = date.getMinutes();
    const roundedMinutes = Math.ceil(minutes / 15) * 15;
    return addMinutes(date, roundedMinutes - minutes);
}
