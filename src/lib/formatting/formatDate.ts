export function formatDate(date: Date, options?: Intl.DateTimeFormatOptions) {
    console.log(date);
    return new Intl.DateTimeFormat(undefined, options).format(date);
}
