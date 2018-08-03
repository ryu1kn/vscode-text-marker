import {mock, mockMethods, mockType, verify, when} from '../helpers/helper';
import {Event} from '../../lib/const';
import SavedHighlightsRestorer from '../../lib/saved-highlights-restorer';
import ConfigStore from '../../lib/config-store';
import DecorationOperatorFactory from '../../lib/decoration-operator-factory';
import PatternFactory from '../../lib/pattern-factory';
import DecorationOperator from '../../lib/decoration-operator';
import StringPattern from '../../lib/patterns/string';

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
        const pattern = mock(StringPattern);
        const configStore = mockType<ConfigStore>({savedHighlights: savedDecorations});
        const decorationOperator = mock(DecorationOperator);
        const decorationOperatorFactory = mock(DecorationOperatorFactory);
        when(decorationOperatorFactory.createForVisibleEditors()).thenReturn(decorationOperator);
        const patternFactory = mockMethods<PatternFactory>(['create']);
        when(patternFactory.create({
            type: 'String',
            phrase: 'PHRASE',
            ignoreCase: false,
            wholeMatch: false
        })).thenReturn(pattern);
        new SavedHighlightsRestorer(configStore, decorationOperatorFactory, patternFactory, eventBus); // eslint-disable-line no-new

        eventBus.on(Event.EXTENSION_READY, () => {
            verify(decorationOperator.addDecoration(pattern));
            done();
        });

        eventBus.emit(Event.EXTENSION_READY);
    });

});
