export type UnionOmit<T, K extends string | number | symbol> = T extends unknown
    ? Omit<T, K>
    : never;

export type UnionPick<T, K extends keyof T> = T extends unknown
    ? Pick<T, K>
    : never;

export type WeekStartsOn = 0 | 1;
