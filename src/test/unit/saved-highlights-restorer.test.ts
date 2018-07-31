import {expect, sinon, stubWithArgs} from '../helpers/helper';

const EventEmitter = require('events');
import {Event} from '../../lib/const';
import SavedHighlightsRestorer from '../../lib/saved-highlights-restorer';

suite('SavedHighlightsRestorer', () => {

    test('it restores saved highlights', done => {
        const eventBus = new EventEmitter();
        const savedDecorations = [{
            pattern: {
                type: 'string',
                expression: 'PHRASE',
                ignoreCase: false,
                wholeMatch: false
            }
        }];
        const configStore = {savedHighlights: savedDecorations};
        const decorationOperator = {addDecoration: sinon.spy()};
        const decorationOperatorFactory = {createForVisibleEditors: () => decorationOperator};
        const patternFactory = {
            create: stubWithArgs([{
                type: 'String',
                phrase: 'PHRASE',
                ignoreCase: false,
                wholeMatch: false
            }], 'PATTERN')
        };
        new SavedHighlightsRestorer(configStore, decorationOperatorFactory, patternFactory, eventBus); // eslint-disable-line no-new

        eventBus.on(Event.EXTENSION_READY, () => {
            expect(decorationOperator.addDecoration).to.have.been.calledWith('PATTERN');
            done();
        });

        eventBus.emit(Event.EXTENSION_READY);
    });

});
