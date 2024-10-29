export function getDay(date: Date, weekStartsOn: 0 | 1 = 1) {
    const day = date.getDay();
    return (day + 7 - weekStartsOn) % 7;
}
