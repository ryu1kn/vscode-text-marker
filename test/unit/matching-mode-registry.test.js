
const EventEmitter = require('events');
const Event = require('../../lib/const').Event;
const MatchingModeRegistry = require('../../lib/matching-mode-registry');

suite('MatchingModeRegistry', () => {

    test('it holds current matching mode', () => {
        const eventBus = new EventEmitter();
        const registry = new MatchingModeRegistry({eventBus});
        expect(registry.mode).to.eql({ignoreCase: false});
    });

    test('it reverses the case sensitivity', () => {
        const eventBus = new EventEmitter();
        const registry = new MatchingModeRegistry({eventBus});
        registry.toggleCaseSensitivity();
        expect(registry.mode).to.eql({ignoreCase: true});
    });

    test('it broadcasts if case sensitivity has been updated', done => {
        const eventBus = new EventEmitter();
        const registry = new MatchingModeRegistry({eventBus});

        eventBus.on(Event.TOGGLED_CASE_SENSITIVITY, mode => {
            expect(mode).to.have.property('ignoreCase');
            done();
        });
        registry.toggleCaseSensitivity();
    });

    test('after extension started, it broadcast if it is ready', done => {
        const eventBus = new EventEmitter();
        new MatchingModeRegistry({eventBus});       // eslint-disable-line no-new

        eventBus.on(Event.MATCHING_MODE_INITIALISED, mode => {
            expect(mode).to.have.property('ignoreCase');
            done();
        });
        eventBus.emit(Event.EXTENSION_READY);
    });

});
