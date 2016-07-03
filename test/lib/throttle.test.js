
const Throttle = require('../../lib/throttle');

suite('Throttle', () => {

    test('it returns list of Range s which locates all the strings equals to the given text', done => {
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
});
