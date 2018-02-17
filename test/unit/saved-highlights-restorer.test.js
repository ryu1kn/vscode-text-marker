
const EventEmitter = require('events');
const {Event} = require('../../lib/const');
const SavedHighlightsRestorer = require('../../lib/saved-highlights-restorer');

suite('SavedHighlightsRestorer', () => {

    test('it restores saved highlights', done => {
        const eventBus = new EventEmitter();
        const configStore = {get: stubWithArgs(['savedHighlights'], [{pattern: 'PATTERN_DATA'}])};
        const decorationOperator = {addDecoration: sinon.spy()};
        const decorationOperatorFactory = {createForVisibleEditors: () => decorationOperator};
        const patternFactory = {create: stubWithArgs(['PATTERN_DATA'], 'PATTERN')};
        new SavedHighlightsRestorer({eventBus, configStore, decorationOperatorFactory, patternFactory}); // eslint-disable-line no-new

        eventBus.on(Event.EXTENSION_READY, () => {
            expect(decorationOperator.addDecoration).to.have.been.calledWith('PATTERN');
            done();
        });

        eventBus.emit(Event.EXTENSION_READY);
    });

});
