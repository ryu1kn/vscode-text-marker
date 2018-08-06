import * as assert from 'assert';

export const assertKeyExists = (obj: object, key: string) => {
    assert.ok(obj.hasOwnProperty(key), `Key (${key}) does not exist in the object`);
};

export function assertInstanceOf<T>(obj: any, c: new (...args: any[]) => T) {
    assert.ok(obj instanceof c, `Object is not an instance of ${c.name}`);
}
