import {expect, mock, mockType, mockTypeWithMethod, sinon, when} from '../helpers/helper';
import {Event} from '../../lib/const';
import SavedHighlightsRestorer from '../../lib/saved-highlights-restorer';
import ConfigStore from '../../lib/config-store';
import DecorationOperatorFactory from '../../lib/decoration-operator-factory';
import PatternFactory from '../../lib/pattern-factory';

const EventEmitter = require('events');

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
        const configStore = mockType<ConfigStore>({savedHighlights: savedDecorations});
        const decorationOperator = {addDecoration: sinon.spy()};
        const decorationOperatorFactory = mock(DecorationOperatorFactory);
        when(decorationOperatorFactory.createForVisibleEditors()).thenReturn(decorationOperator);
        const patternFactory = mockTypeWithMethod<PatternFactory>(['create']);
        when(patternFactory.create({
            type: 'String',
            phrase: 'PHRASE',
            ignoreCase: false,
            wholeMatch: false
        })).thenReturn('PATTERN');
        new SavedHighlightsRestorer(configStore, decorationOperatorFactory, patternFactory, eventBus); // eslint-disable-line no-new

        eventBus.on(Event.EXTENSION_READY, () => {
            expect(decorationOperator.addDecoration).to.have.been.calledWith('PATTERN');
            done();
        });

        eventBus.emit(Event.EXTENSION_READY);
    });

});
