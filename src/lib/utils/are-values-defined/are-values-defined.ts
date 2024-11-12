export function areValuesDefined<T>(
    values: Partial<T> | null | undefined
): values is Required<T> {
    if (values === null || values === undefined) {
        return false;
    }

    return Object.values(values).every(value => {
        if (typeof value === "object" && value !== null) {
            return areValuesDefined(value);
        }
        return value !== undefined;
    });
}
