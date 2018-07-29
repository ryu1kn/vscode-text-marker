import {expect} from '../helpers/helper';
import {Event} from '../../lib/const';
import MatchingModeRegistry from '../../lib/matching-mode-registry';

const EventEmitter = require('events');

suite('MatchingModeRegistry', () => {
    let eventBus;
    let registry;

    setup(() => {
        eventBus = new EventEmitter();
        registry = new MatchingModeRegistry({
            eventBus,
            ignoreCase: true,
            wholeMatch: false
        });
    });

    test('it holds current matching mode', () => {
        expect(registry.mode).to.eql({
            ignoreCase: true,
            wholeMatch: false
        });
    });

    test('it reverses the case sensitivity', () => {
        registry.toggleCaseSensitivity();
        expect(registry.mode).to.contain({ignoreCase: false});
    });

    test('it broadcasts if case sensitivity has been updated', done => {
        eventBus.on(Event.TOGGLED_CASE_SENSITIVITY, mode => {
            expect(mode).to.have.property('ignoreCase');
            done();
        });
        registry.toggleCaseSensitivity();
    });

    test('it reverses the whole/partial match', () => {
        registry.toggleWholeMatch();
        expect(registry.mode).to.contain({wholeMatch: true});
    });

    test('it broadcasts if whole/partial match has been toggled', done => {
        eventBus.on(Event.WHOLE_MATCH_MODE_TOGGLED, mode => {
            expect(mode).to.have.property('wholeMatch');
            done();
        });
        registry.toggleWholeMatch();
    });

    test('after extension started, it broadcast if it is ready', done => {
        eventBus.on(Event.MATCHING_MODE_INITIALISED, mode => {
            expect(mode).to.have.property('ignoreCase');
            done();
        });
        eventBus.emit(Event.EXTENSION_READY);
    });

});
