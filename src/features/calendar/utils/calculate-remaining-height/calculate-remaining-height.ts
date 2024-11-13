export function calculateRemainingHeight(
    element: Element,
    threshold = 0
): number {
    const computedStyles = getComputedStyle(element);

    const computedStyleSum = [
        computedStyles.paddingBlockStart,
        computedStyles.paddingBlockEnd,
        computedStyles.borderBlockStartWidth,
        computedStyles.borderBlockEndWidth,
        computedStyles.rowGap,
    ].reduce((acc, cur) => {
        return acc + parseInt(cur);
    }, 0);

    return element.clientHeight - computedStyleSum - threshold;
}
