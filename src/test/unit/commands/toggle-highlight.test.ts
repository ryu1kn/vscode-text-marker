import {mock, mockType, verify, when} from '../../helpers/helper';

import ToggleHighlightCommand from '../../../lib/commands/toggle-highlight';
import DecorationOperatorFactory from '../../../lib/decoration-operator-factory';
import TextEditor from '../../../lib/text-editor';
import TextLocationRegistry from '../../../lib/text-location-registry';
import DecorationOperator from '../../../lib/decoration-operator';
import MatchingModeRegistry from '../../../lib/matching-mode-registry';
import StringPattern from '../../../lib/patterns/string';

suite('ToggleHighlightCommand', () => {

    const matchingModeRegistry = mockType<MatchingModeRegistry>();

    const registeredRange = {start: 10, end: 20};
    const unregisteredRange = {start: 0, end: 0};

    const textLocationRegistry = new TextLocationRegistry();
    textLocationRegistry.register('EDITOR_ID', 'DECORATION_ID', [registeredRange]);

    suite('When text is selected', () => {

        test('it decorates a selected text if the cursor is not on highlight', () => {
            const editor = mockType<TextEditor>({id: 'EDITOR_ID', selectedText: 'SELECTED', selection: unregisteredRange});
            const decorationOperator = mock(DecorationOperator);
            const decorationOperatorFactory = mock(DecorationOperatorFactory);
            when(decorationOperatorFactory.createForVisibleEditors()).thenReturn(decorationOperator);
            const command = new ToggleHighlightCommand(
                decorationOperatorFactory,
                matchingModeRegistry,
                textLocationRegistry
            );
            command.execute(editor);

            verify(decorationOperator.addDecoration(new StringPattern({phrase: 'SELECTED'})));
        });

        test('it remove decoration if the cursor is on highlight', () => {
            const editor = mockType<TextEditor>({id: 'EDITOR_ID', selectedText: 'SELECTED', selection: registeredRange});
            const decorationOperator = mock(DecorationOperator);
            const decorationOperatorFactory = mock(DecorationOperatorFactory);
            when(decorationOperatorFactory.createForVisibleEditors()).thenReturn(decorationOperator);
            const command = new ToggleHighlightCommand(
                decorationOperatorFactory,
                matchingModeRegistry,
                textLocationRegistry
            );
            command.execute(editor);

            verify(decorationOperator.removeDecoration('DECORATION_ID'));
        });
    });

    suite('When text is NOT selected', () => {

        const decorationOperatorFactory = mock(DecorationOperatorFactory);
        const command = new ToggleHighlightCommand(decorationOperatorFactory, matchingModeRegistry, textLocationRegistry);

        test('it does nothing if text is not selected', () => {
            const editor = mockType<TextEditor>({id: 'EDITOR_ID', selectedText: '', selection: unregisteredRange});

            command.execute(editor);

            verify(decorationOperatorFactory.createForVisibleEditors(), {times: 0});
        });
    });
});
