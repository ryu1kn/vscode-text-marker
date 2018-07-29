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
