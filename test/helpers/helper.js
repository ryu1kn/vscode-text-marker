const chai = require('chai');
chai.use(require('sinon-chai'));

const sinon = require('sinon');

exports.expect = chai.expect;

exports.sinon = sinon;

exports.stubWithArgs = (...args) => {
    const stub = sinon.stub();
    for (let i = 0; i + 1 < args.length; i += 2) {
        stub.withArgs.apply(stub, args[i]).returns(args[i + 1]);
    }
    return stub;
};

exports.stubReturns = (...args) =>
    args.reduce(
        (stub, arg, index) => {
            stub.onCall(index).returns(arg);
            return stub;
        },
        sinon.stub()
    );
