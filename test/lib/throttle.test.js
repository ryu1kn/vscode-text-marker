
const Throttle = require('../../lib/throttle');

suite('Throttle', () => {

    test('it suppresses the multiple calls of given callback happened in the certain time period only once', done => {
        const configStore = {get: stubWithArgs(['decorationRefreshDelay'], 1)};
        const throttle = new Throttle({configStore});
        const callbackSpy = sinon.spy();

        throttle.throttle(callbackSpy);
        throttle.throttle(callbackSpy);
        throttle.throttle(callbackSpy);

        setTimeout(() => {
            expect(callbackSpy).to.have.callCount(1);
            done();
        }, 10);
    });

    test("it doesn't invoke the callback if non number throttling time is given", done => {
        const configStore = {get: stubWithArgs(['decorationRefreshDelay'], null)};
        const throttle = new Throttle({configStore});

        const callbackSpy = sinon.spy();
        throttle.throttle(callbackSpy);

        setTimeout(() => {
            expect(callbackSpy).to.have.been.not.called;
            done();
        }, 10);
    });
});
