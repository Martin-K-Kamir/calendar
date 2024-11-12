export function groupChildrenByColumn(
    children: HTMLElement[]
): Record<string, HTMLElement[]> {
    return children.reduce((acc, child) => {
        const colStart = parseInt(child.style.gridColumnStart);
        const colEnd = parseInt(child.style.gridColumnEnd);

        for (let i = colStart; i < colEnd; i++) {
            acc[i] = [...(acc[i] ?? []), child];
        }

        return acc;
    }, {} as Record<string, HTMLElement[]>);
}
