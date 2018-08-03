import * as td from 'testdouble';

export const expect = require('chai').expect;

export const stubReturns = (...args: any[]) => () => args.shift();

export const when = td.when;

export const verify = td.verify;

export function wrapVerify(invokeCallback: (...args: any[]) => void, expectedCalls: any[][] | {[key: string]: any[]}) {
    const captors = [td.matchers.captor(), td.matchers.captor(), td.matchers.captor()];

    invokeCallback(...captors.map(captor => captor.capture));

    const toIndex = (key: string) => parseInt(key.replace('call', ''), 10);

    Object.entries(expectedCalls).forEach(([key, value]) => {
        const callIndex = toIndex(key);
        (value as any[]).forEach((expectedArg, argIndex) => {
            const failureMessage = `Check argument ${argIndex} of call ${callIndex}`;
            expect(captors[argIndex].values![callIndex]).to.eql(expectedArg, failureMessage);
        });
    });
}

export const contains = td.matchers.contains;

export const any = td.matchers.anything;

export const callback = td.callback;

export function mock<T>(c: new (...args: any[]) => T): T {
    return new (td.constructor(c));
}

export function mockFunction() {
    return td.function();
}

export function mockType<T>(params?: any): T {
    return Object.assign({} as T, params);
}

export function mockMethods<T>(methods: string[], params?: any): T {
    return Object.assign(td.object(methods) as T, params);
}
