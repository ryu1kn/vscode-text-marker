import {any, mock, mockType, verify, when} from '../../helpers/helper';

import UpdateHighlightCommand from '../../../lib/commands/update-highlight';
import DecorationOperatorFactory from '../../../lib/decoration-operator-factory';
import DecorationRegistry from '../../../lib/decoration-registry';
import PatternVariationReader from '../../../lib/pattern-variation-reader';
import StringPattern from '../../../lib/patterns/string';
import TextLocationRegistry from '../../../lib/text-location-registry';
import TextEditor from '../../../lib/text-editor';
import DecorationOperator from '../../../lib/decoration-operator';

suite('UpdateHighlightCommand', () => {

    suite('When the cursor is on highlight', () => {

        const editor = mockType<TextEditor>({selectedText: null});

        const oldPattern = mock(StringPattern);
        const newPattern = mock(StringPattern);

        const textLocationRegistry = mock(TextLocationRegistry);
        when(textLocationRegistry.queryDecorationId(any(), any())).thenReturn('DECORATION_ID');

        const decorationRegistry = mock(DecorationRegistry);
        when(decorationRegistry.inquireById('DECORATION_ID')).thenReturn({pattern: oldPattern});

        test('it updates decoration', async () => {
            const decorationOperator = mock(DecorationOperator);
            const decorationOperatorFactory = mock(DecorationOperatorFactory);
            when(decorationOperatorFactory.createForVisibleEditors()).thenReturn(decorationOperator);

            const patternVariationReader = mock(PatternVariationReader);
            when(patternVariationReader.read(oldPattern)).thenResolve(newPattern);

            const command = new UpdateHighlightCommand(
                decorationOperatorFactory,
                decorationRegistry,
                patternVariationReader,
                textLocationRegistry
            );

            await command.execute(editor);

            verify(decorationOperator.updateDecorationPattern('DECORATION_ID', newPattern));
        });

        test('it does nothing if a new pattern is not given by user', async () => {
            const decorationOperatorFactory = mock(DecorationOperatorFactory);

            const patternVariationReader = mock(PatternVariationReader);
            when(patternVariationReader.read(any())).thenResolve();

            const command = new UpdateHighlightCommand(
                decorationOperatorFactory,
                decorationRegistry,
                patternVariationReader,
                textLocationRegistry
            );

            await command.execute(editor);

            verify(decorationOperatorFactory.createForVisibleEditors(), {times: 0});
        });
    });

    suite('When the cursor is NOT on highlight', () => {
        const decorationOperatorFactory = mock(DecorationOperatorFactory);
        const decorationRegistry = mock(DecorationRegistry);
        const patternVariationReader = mock(PatternVariationReader);

        test('it does nothing', async () => {
            const editor = mockType<TextEditor>({selectedText: null});
            const textLocationRegistry = mock(TextLocationRegistry);
            when(textLocationRegistry.queryDecorationId(any(), any())).thenReturn(null);
            const command = new UpdateHighlightCommand(
                decorationOperatorFactory,
                decorationRegistry,
                patternVariationReader,
                textLocationRegistry
            );

            await command.execute(editor);

            verify(decorationRegistry.inquireById(any()), {times: 0});
        });
    });
});
