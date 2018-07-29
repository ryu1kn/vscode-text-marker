import {expect, sinon, stubWithArgs} from '../helpers/helper';

import Debouncer from '../../lib/debouncer';

suite('Debouncer', () => {

    test('it suppresses the multiple calls of given callback happened in the certain time period only once', done => {
        const configStore = {get: stubWithArgs(['delayForRefreshingHighlight'], 1)};
        const debouncer = new Debouncer({configStore});
        const callbackSpy = sinon.spy();

        debouncer.debounce(callbackSpy);
        debouncer.debounce(callbackSpy);
        debouncer.debounce(callbackSpy);

        setTimeout(() => {
            expect(callbackSpy).to.have.callCount(1);
            done();
        }, 10);
    });

    test("it doesn't invoke the callback if non number debouncing time is given", done => {
        const configStore = {get: stubWithArgs(['delayForRefreshingHighlight'], null)};
        const debouncer = new Debouncer({configStore});

        const callbackSpy = sinon.spy();
        debouncer.debounce(callbackSpy);

        setTimeout(() => {
            expect(callbackSpy).to.have.been.not.called;
            done();
        }, 10);
    });
});
