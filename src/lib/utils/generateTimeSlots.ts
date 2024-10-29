export function generateTimeSlots() {
    const result = [];
    const date = new Date();
    date.setHours(0, 0, 0, 0);

    for (let i = 0; i < 24 * 4; i++) {
        result.push(
            new Intl.DateTimeFormat(undefined, {
                hour: "2-digit",
                minute: "2-digit",
            }).format(date)
        );
        date.setMinutes(date.getMinutes() + 15);
    }

    return result;
}
