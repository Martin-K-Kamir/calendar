export function getColStart(
    index: number,
    weekIndex: number,
    day: number,
    isOverlapping: boolean
) {
    if (isOverlapping) {
        return 1;
    }

    return index === weekIndex ? day + 1 : 1;
}
