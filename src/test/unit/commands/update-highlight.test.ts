import {any, mock, mockType, verify, when} from '../../helpers/mock';

import UpdateHighlightCommand from '../../../lib/commands/update-highlight';
import DecorationOperatorFactory from '../../../lib/decoration-operator-factory';
import DecorationRegistry from '../../../lib/decoration-registry';
import PatternVariationReader from '../../../lib/pattern-variation-reader';
import StringPattern from '../../../lib/patterns/string';
import TextLocationRegistry from '../../../lib/text-location-registry';
import TextEditor from '../../../lib/text-editor';
import DecorationOperator from '../../../lib/decoration-operator';

suite('UpdateHighlightCommand', () => {

    const registeredRange = {start: 10, end: 20};
    const unregisteredRange = {start: 0, end: 0};

    const textLocationRegistry = new TextLocationRegistry();
    textLocationRegistry.register('EDITOR_ID', 'DECORATION_ID', [registeredRange]);

    suite('When the cursor is on highlight', () => {

        const editor = mockType<TextEditor>({id: 'EDITOR_ID', selectedText: 'SELECTED', selection: registeredRange});

        const oldPattern = mock(StringPattern);
        const newPattern = mock(StringPattern);

        const decorationRegistry = mock(DecorationRegistry);
        when(decorationRegistry.inquireById('DECORATION_ID')).thenReturn({pattern: oldPattern});

        let decorationOperator: DecorationOperator;
        let decorationOperatorFactory: DecorationOperatorFactory;

        setup(() => {
            const deps = createDecorationOperator();
            decorationOperator = deps.decorationOperator;
            decorationOperatorFactory = deps.decorationOperatorFactory;
        });

        test('it updates decoration', async () => {
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
            const patternVariationReader = mock(PatternVariationReader);
            when(patternVariationReader.read(any())).thenResolve();

            const command = new UpdateHighlightCommand(
                decorationOperatorFactory,
                decorationRegistry,
                patternVariationReader,
                textLocationRegistry
            );

            await command.execute(editor);

            verify(decorationOperator.updateDecorationPattern(any(), any()), {times: 0});
        });
    });

    suite('When the cursor is NOT on highlight', () => {
        const deps = createDecorationOperator();
        const {decorationOperator, decorationOperatorFactory} = deps;

        const decorationRegistry = mock(DecorationRegistry);
        const patternVariationReader = mock(PatternVariationReader);

        const editor = mockType<TextEditor>({id: 'EDITOR_ID', selectedText: 'SELECTED', selection: unregisteredRange});

        test('it does nothing', async () => {
            const command = new UpdateHighlightCommand(
                decorationOperatorFactory,
                decorationRegistry,
                patternVariationReader,
                textLocationRegistry
            );

            await command.execute(editor);

            verify(decorationOperator.updateDecorationPattern(any(), any()), {times: 0});
        });
    });

    function createDecorationOperator() {
        const decorationOperator = mock(DecorationOperator);
        const decorationOperatorFactory = mock(DecorationOperatorFactory);
        when(decorationOperatorFactory.createForVisibleEditors()).thenReturn(decorationOperator);
        return {decorationOperator, decorationOperatorFactory};
    }
});
