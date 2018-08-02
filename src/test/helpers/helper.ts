import * as td from 'testdouble';

const chai = require('chai');
chai.use(require('sinon-chai'));

export const sinon = require('sinon');

export const expect = chai.expect;

export const stubWithArgs = (...args) => {
    const stub = sinon.stub();
    for (let i = 0; i + 1 < args.length; i += 2) {
        stub.withArgs.apply(stub, args[i]).returns(args[i + 1]);
    }
    return stub;
};

export const stubReturns = (...args) =>
    args.reduce(
        (stub, arg, index) => {
            stub.onCall(index).returns(arg);
            return stub;
        },
        sinon.stub()
    );

export const when = td.when;

export const verify = td.verify;

export function wrapVerify(invokeCallback, expectedCalls: any[][]) {
    const captors = [td.matchers.captor(), td.matchers.captor(), td.matchers.captor()];

    invokeCallback(...captors.map(captor => captor.capture));

    expectedCalls.forEach((call, callIndex) => {
        call.forEach((expectedArg, argIndex) => {
            const failureMessage = `Check argument ${argIndex} of call ${callIndex}`;
            expect(captors[argIndex].values[callIndex]).to.eql(expectedArg, failureMessage);
        });
    });
}

export const contains = td.matchers.contains;

export const any = td.matchers.anything;

export const callback = td.callback;

export function mock<T>(c: new (...args: any[]) => T): T {
    return new (td.constructor(c));
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
