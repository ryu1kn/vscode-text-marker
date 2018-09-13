import {any, mock, mockType, verify, when} from '../../helpers/mock';

import UpdateHighlightCommand from '../../../lib/commands/update-highlight';
import DecorationOperatorFactory from '../../../lib/decoration/decoration-operator-factory';
import DecorationRegistry from '../../../lib/decoration/decoration-registry';
import PatternVariationReader from '../../../lib/pattern/pattern-variation-reader';
import StringPattern from '../../../lib/pattern/string';
import TextLocationRegistry from '../../../lib/text-location-registry';
import TextEditor from '../../../lib/vscode/text-editor';
import DecorationOperator from '../../../lib/decoration/decoration-operator';
import {none, some} from 'fp-ts/lib/Option';
import {Decoration} from '../../../lib/entities/decoration';
import {TextEditorDecorationType} from 'vscode';

suite('UpdateHighlightCommand', () => {

    const registeredRange = {start: 10, end: 20};
    const unregisteredRange = {start: 0, end: 0};

    const textLocationRegistry = new TextLocationRegistry();
    textLocationRegistry.register('EDITOR_ID', 'DECORATION_ID', [registeredRange]);

    suite('When the cursor is on highlight', () => {

        const editor = mockType<TextEditor>({id: 'EDITOR_ID', selectedText: 'SELECTED', selection: registeredRange});

        const decorationType = mockType<TextEditorDecorationType>();
        const oldPattern = mock(StringPattern);
        const newPattern = mock(StringPattern);
        const decoration = new Decoration('DECORATION_ID', oldPattern, 'pink', decorationType);

        const decorationRegistry = mock(DecorationRegistry);
        when(decorationRegistry.inquireById('DECORATION_ID')).thenReturn(some(decoration));

        let decorationOperator: DecorationOperator;
        let decorationOperatorFactory: DecorationOperatorFactory;

        setup(() => {
            const deps = createDecorationOperator();
            decorationOperator = deps.decorationOperator;
            decorationOperatorFactory = deps.decorationOperatorFactory;
        });

        test('it updates decoration', async () => {
            const patternVariationReader = mock(PatternVariationReader);
            when(patternVariationReader.read(oldPattern)).thenResolve(some(newPattern));

            const command = new UpdateHighlightCommand(
                decorationOperatorFactory,
                decorationRegistry,
                patternVariationReader,
                textLocationRegistry
            );

            await command.execute(editor);

            verify(decorationOperator.updateDecoration(decoration, decoration.withPattern(newPattern)));
        });

        test('it does nothing if a new pattern is not given by user', async () => {
            const patternVariationReader = mock(PatternVariationReader);
            when(patternVariationReader.read(any())).thenResolve(none);

            const command = new UpdateHighlightCommand(
                decorationOperatorFactory,
                decorationRegistry,
                patternVariationReader,
                textLocationRegistry
            );

            await command.execute(editor);

            verify(decorationOperator.updateDecoration(any(), any()), {times: 0});
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

            verify(decorationOperator.updateDecoration(any(), any()), {times: 0});
        });
    });

    function createDecorationOperator() {
        const decorationOperator = mock(DecorationOperator);
        const decorationOperatorFactory = mock(DecorationOperatorFactory);
        when(decorationOperatorFactory.createForVisibleEditors()).thenReturn(decorationOperator);
        return {decorationOperator, decorationOperatorFactory};
    }
});
