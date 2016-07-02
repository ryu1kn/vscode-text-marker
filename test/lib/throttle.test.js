
const Throttle = require('../../lib/throttle');

suite('Throttle', () => {

    test('it returns list of Range s which locates all the strings equals to the given text', done => {
        const callbackSpy = sinon.spy();
        const throttle = new Throttle({delayMsec: 1});

        throttle.throttle(callbackSpy);
        throttle.throttle(callbackSpy);
        throttle.throttle(callbackSpy);

        setTimeout(() => {
            expect(callbackSpy).to.have.callCount(1);
            done();
        }, 10);
    });
});
