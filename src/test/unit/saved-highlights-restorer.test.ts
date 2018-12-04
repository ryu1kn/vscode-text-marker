import {mock, mockType, verify, when} from '../helpers/mock';
import {Event} from '../../lib/const';
import SavedHighlightsRestorer from '../../lib/saved-highlights-restorer';
import ConfigStore from '../../lib/config-store';
import DecorationOperatorFactory from '../../lib/decoration/decoration-operator-factory';
import DecorationOperator from '../../lib/decoration/decoration-operator';
import StringPattern from '../../lib/pattern/string';
import MatchingModeRegistry from '../../lib/matching-mode-registry';

const EventEmitter = require('events');

suite('SavedHighlightsRestorer', () => {

    const matchingModeRegistry = mockType<MatchingModeRegistry>();

    test('it restores saved highlights', done => {
        const eventBus = new EventEmitter();
        const savedDecorations = [{
            pattern: {
                type: 'string',
                expression: 'PHRASE',
                ignoreCase: false,
                wholeMatch: false
            },
            color: '#F7E4B3'
        }];
        const configStore = mockType<ConfigStore>({savedHighlights: savedDecorations});
        const decorationOperator = mock(DecorationOperator);
        const decorationOperatorFactory = mock(DecorationOperatorFactory);
        when(decorationOperatorFactory.createForVisibleEditors()).thenReturn(decorationOperator);
        new SavedHighlightsRestorer(configStore, decorationOperatorFactory, matchingModeRegistry, eventBus);

        eventBus.on(Event.EXTENSION_READY, () => {
            verify(decorationOperator.addDecoration(new StringPattern({
                phrase: 'PHRASE',
                ignoreCase: false,
                wholeMatch: false
            }), '#F7E4B3'));
            done();
        });

        eventBus.emit(Event.EXTENSION_READY);
    });

});
