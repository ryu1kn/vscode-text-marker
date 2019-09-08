import {fromNullable, Option} from 'fp-ts/lib/Option';
import {findFirst} from 'fp-ts/lib/Array';

export interface ObjectMap<T> {
    [key: string]: T;
}

function toMap<T>(object: ObjectMap<T>): Map<string, T> {
    const tuples = Object.entries(object).reduce(
        (previous: [string, T][], currentValue) => [...previous, currentValue],
        []
    );
    return new Map(tuples);
}

export class OptionMap<T> {
    private readonly map: Map<string, T>;

    constructor(object: ObjectMap<T> = {}) {
        this.map = toMap(object);
    }

    set(key: string, value: T) {
        this.map.set(key, value);
    }

    get(key: string): Option<T> {
        return fromNullable(this.map.get(key));
    }

    delete(key: string): void {
        this.map.delete(key);
    }

    values(): IterableIterator<T> {
        return this.map.values();
    }

    entries(): IterableIterator<[string, T]> {
        return this.map.entries();
    }

    toList(): T[] {
        return Array.from(this.values());
    }

    find(predicate: (d: T) => boolean): Option<T> {
        return findFirst(predicate)(this.toList());
    }
}
