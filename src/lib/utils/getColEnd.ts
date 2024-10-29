export function getColEnd(
    index: number,
    weekIndex: number,
    day: number,
    isOverlapping: boolean
) {
    if (isOverlapping) {
        return 8;
    }

    return index === weekIndex ? day + 2 : 8;
}
