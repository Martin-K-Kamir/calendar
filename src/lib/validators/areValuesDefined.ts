export function areValuesDefined<T>(values: Partial<T>): values is Required<T> {
    return Object.values(values).every(value => {
        if (typeof value === "object" && value !== null) {
            return areValuesDefined(value);
        }

        return value !== undefined;
    });
}
