import {assertKeyExists} from '../helpers/helper';
import {Event} from '../../lib/const';
import MatchingModeRegistry from '../../lib/matching-mode-registry';
import {EventEmitter} from 'events';
import * as assert from 'assert';

suite('MatchingModeRegistry', () => {
    let eventBus: EventEmitter;
    let registry: MatchingModeRegistry;

    setup(() => {
        eventBus = new EventEmitter();
        registry = new MatchingModeRegistry(true, false, eventBus);
    });

    test('it holds current matching mode', () => {
        assert.deepEqual(registry.mode, {
            ignoreCase: true,
            wholeMatch: false
        });
    });

    test('it reverses the case sensitivity', () => {
        registry.toggleCaseSensitivity();
        assert.equal(registry.mode.ignoreCase, false);
    });

    test('it broadcasts if case sensitivity has been updated', done => {
        eventBus.on(Event.TOGGLED_CASE_SENSITIVITY, (mode: any) => {
            assertKeyExists(mode, 'ignoreCase');
            done();
        });
        registry.toggleCaseSensitivity();
    });

    test('it reverses the whole/partial match', () => {
        registry.toggleWholeMatch();
        assert.equal(registry.mode.wholeMatch, true);
    });

    test('it broadcasts if whole/partial match has been toggled', done => {
        eventBus.on(Event.WHOLE_MATCH_MODE_TOGGLED, (mode: any) => {
            assertKeyExists(mode, 'wholeMatch');
            done();
        });
        registry.toggleWholeMatch();
    });

    test('after extension started, it broadcast if it is ready', done => {
        eventBus.on(Event.MATCHING_MODE_INITIALISED, (mode: any) => {
            assertKeyExists(mode, 'ignoreCase');
            done();
        });
        eventBus.emit(Event.EXTENSION_READY);
    });

});
