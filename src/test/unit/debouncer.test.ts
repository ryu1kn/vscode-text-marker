import {AnyFunction, mockFunction, mockType, verify} from '../helpers/mock';

import Debouncer from '../../lib/debouncer';
import ConfigStore from '../../lib/config-store';

suite('Debouncer', () => {

    test('it suppresses the multiple calls of given callback happened in the certain time period only once', done => {
        const configStore = mockType<ConfigStore>({delayForRefreshingHighlight: 1});
        const debouncer = new Debouncer(configStore);
        const callbackSpy = mockFunction() as AnyFunction;

        debouncer.debounce(callbackSpy);
        debouncer.debounce(callbackSpy);
        debouncer.debounce(callbackSpy);

        setTimeout(() => {
            verify(callbackSpy(), {times: 1, ignoreExtraArgs: true});
            done();
        }, 10);
    });

    test("it doesn't invoke the callback if non number debouncing time is given", done => {
        const configStore = mockType<ConfigStore>({delayForRefreshingHighlight: null});
        const debouncer = new Debouncer(configStore);

        const callback = mockFunction() as AnyFunction;
        debouncer.debounce(callback);

        setTimeout(() => {
            verify(callback(), {times: 0});
            done();
        }, 10);
    });
});
