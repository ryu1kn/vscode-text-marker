
const Debouncer = require('../../lib/debouncer');

suite('Debouncer', () => {

    test('it suppresses the multiple calls of given callback happened in the certain time period only once', done => {
        const configStore = {get: stubWithArgs(['decorationRefreshDelay'], 1)};
        const debounce = new Debouncer({configStore});
        const callbackSpy = sinon.spy();

        debounce.debounce(callbackSpy);
        debounce.debounce(callbackSpy);
        debounce.debounce(callbackSpy);

        setTimeout(() => {
            expect(callbackSpy).to.have.callCount(1);
            done();
        }, 10);
    });

    test("it doesn't invoke the callback if non number debouncing time is given", done => {
        const configStore = {get: stubWithArgs(['decorationRefreshDelay'], null)};
        const debouncer = new Debouncer({configStore});

        const callbackSpy = sinon.spy();
        debouncer.debounce(callbackSpy);

        setTimeout(() => {
            expect(callbackSpy).to.have.been.not.called;
            done();
        }, 10);
    });
});
