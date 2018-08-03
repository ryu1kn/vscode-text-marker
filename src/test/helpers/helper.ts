import * as td from 'testdouble';

const chai = require('chai');
chai.use(require('sinon-chai'));

export const sinon = require('sinon');

export const expect = chai.expect;

export const stubReturns = (...args: any[]) => () => args.shift();

export const when = td.when;

export const verify = td.verify;

export function wrapVerify(invokeCallback: (...args: any[]) => void, expectedCalls: any[][]) {
    const captors = [td.matchers.captor(), td.matchers.captor(), td.matchers.captor()];

    invokeCallback(...captors.map(captor => captor.capture));

    expectedCalls.forEach((call, callIndex) => {
        call.forEach((expectedArg, argIndex) => {
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

export function mockType<T>(params: any): T {
    return Object.assign({} as T, params);
}

export function mockTypeWithMethod<T>(methods: string[]): T {
    return td.object(methods) as T;
}

export function mockObject(...propNames: string[]) {
    return td.object(propNames);
}
