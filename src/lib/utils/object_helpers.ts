// typesafe object entries
export function object_entries<T extends object>(obj: T) {
    return Object.entries(obj) as [keyof T, T[keyof T]][];
}

export function object_keys<T extends object>(obj: T) {
    return Object.keys(obj) as (keyof T)[];
}