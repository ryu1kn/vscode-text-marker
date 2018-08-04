import {any, mock, mockType, verify, when} from '../../helpers/helper';

import ToggleHighlightCommand from '../../../lib/commands/toggle-highlight';
import PatternFactory from '../../../lib/pattern-factory';
import DecorationOperatorFactory from '../../../lib/decoration-operator-factory';
import TextEditor from '../../../lib/text-editor';
import TextLocationRegistry from '../../../lib/text-location-registry';
import RegexPattern from '../../../lib/patterns/regex';
import DecorationOperator from '../../../lib/decoration-operator';
import MatchingModeRegistry from '../../../lib/matching-mode-registry';
import {none, some} from 'fp-ts/lib/Option';

suite('ToggleHighlightCommand', () => {

    const patternFactory = new PatternFactory({} as MatchingModeRegistry);

    suite('When text is selected', () => {

        test('it decorates a selected text if the cursor is not on highlight', () => {
            const editor = {selectedText: 'SELECTED'} as TextEditor;
            const textLocationRegistry = mock(TextLocationRegistry);
            when(textLocationRegistry.queryDecorationId(any(), any())).thenReturn(none);
            const decorationOperator = mock(DecorationOperator);
            const decorationOperatorFactory = mock(DecorationOperatorFactory);
            when(decorationOperatorFactory.createForVisibleEditors()).thenReturn(decorationOperator);
            const command = new ToggleHighlightCommand(
                decorationOperatorFactory,
                patternFactory,
                textLocationRegistry
            );
            command.execute(editor);

            const pattern = patternFactory.create({phrase: 'SELECTED'});
            verify(decorationOperator.addDecoration(pattern));
        });

        test('it remove decoration if the cursor is on highlight', () => {
            const editor = mockType<TextEditor>({selectedText: null});
            const decorationOperator = mock(DecorationOperator);
            const decorationOperatorFactory = mock(DecorationOperatorFactory);
            when(decorationOperatorFactory.createForVisibleEditors()).thenReturn(decorationOperator);
            const textLocationRegistry = mock(TextLocationRegistry);
            when(textLocationRegistry.queryDecorationId(any(), any())).thenReturn(some('DECORATION_ID'));
            const command = new ToggleHighlightCommand(
                decorationOperatorFactory,
                patternFactory,
                textLocationRegistry
            );
            command.execute(editor);

            verify(decorationOperator.removeDecoration('DECORATION_ID'));
        });
    });

    suite('When text is NOT selected', () => {
        const patternFactory = mock(PatternFactory);
        when(patternFactory.create(any())).thenReturn(mock(RegexPattern));

        const editor = mockType<TextEditor>({selectedText: null});

        test('it does nothing if text is not selected', () => {
            const decorationOperatorFactory = mock(DecorationOperatorFactory);
            const textLocationRegistry = mock(TextLocationRegistry);
            when(textLocationRegistry.queryDecorationId(any(), any())).thenReturn(none);
            const command = new ToggleHighlightCommand(decorationOperatorFactory, patternFactory, textLocationRegistry);
            command.execute(editor);

            verify(decorationOperatorFactory.createForVisibleEditors(), {times: 0});
        });
    });
});
