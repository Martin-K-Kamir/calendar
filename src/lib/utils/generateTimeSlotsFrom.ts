export function generateTimeSlotsFrom(from: Date) {
    const result = [];
    const date = new Date(from);
    const day = date.getDate();

    date.setMinutes(Math.ceil(date.getMinutes() / 15) * 15, 0, 0);

    const timeFormatter = new Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
    });

    const numberFormatter = new Intl.NumberFormat(undefined);

    let extraMinutes = 0;

    while (day === date.getDate()) {
        const timeSlot = timeFormatter.format(date);

        const hours = Math.floor(extraMinutes / 60);
        const minutes = extraMinutes % 60;
        const roundedMinutes = Math.round(minutes / 15) * 15;

        const duration =
            hours > 0
                ? `${numberFormatter.format(hours)}h${
                      roundedMinutes > 0
                          ? ` ${numberFormatter.format(roundedMinutes)}m`
                          : ""
                  }`
                : `${numberFormatter.format(roundedMinutes)}m`;

        result.push({ timeSlot, duration });

        date.setMinutes(date.getMinutes() + 15);
        extraMinutes += 15;
    }

    return result;
}
