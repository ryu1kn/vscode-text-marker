
const chai = require('chai');
chai.use(require('sinon-chai'));

global.expect = chai.expect;
global.sinon = require('sinon');

global.stubWithArgs = function () {
    const args = Array.prototype.slice.call(arguments);
    const stub = sinon.stub();
    for (let i = 0; i + 1 < args.length; i += 2) {
        stub.withArgs.apply(stub, args[i]).returns(args[i + 1]);
    }
    return stub;
};
