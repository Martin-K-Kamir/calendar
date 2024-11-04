export function parseTimeString(timeString: string): Date {
    const date = new Date();
    const [time, modifier] = timeString.split(" ");

    // eslint-disable-next-line prefer-const
    let [hours, minutes] = time.split(":").map(value => {
        return Number.parseInt(value, 10);
    });

    if (modifier) {
        if (modifier.toLowerCase() === "pm" && hours < 12) {
            hours += 12;
        }
        if (modifier.toLowerCase() === "am" && hours === 12) {
            hours = 0;
        }
    }

    date.setHours(hours, minutes, 0, 0);
    return date;
}
