import TextEditor from '../../../lib/text-editor';
import {assertEqual, mock, mockMethods, mockType, verify, when} from '../../helpers/helper';
import TextLocationRegistry from '../../../lib/text-location-registry';
import {NextHighlightCommand} from '../../../lib/commands/next-highlight';
import MatchingModeRegistry from '../../../lib/matching-mode-registry';
import StringPattern from '../../../lib/patterns/string';
import {TextEditorDecorationType} from 'vscode';
import DecorationRegistry from '../../../lib/decoration-registry';
import {Decoration} from '../../../lib/entities/decoration';
import WindowComponent from '../../../lib/editor-components/window';

suite('Next-highlight command', function () {

    const matchingModeRegistry = mockType<MatchingModeRegistry>();

    const registeredRange1 = {start: 10, end: 15};
    const registeredRange2 = {start: 30, end: 35};
    const unregisteredRange = {start: 5, end: 5};

    const newPattern = new StringPattern({phrase: 'TEXT'});
    const decorationType = mockType<TextEditorDecorationType>();

    const textLocationRegistry = new TextLocationRegistry();
    textLocationRegistry.register('EDITOR_ID', 'DECORATION_ID', [registeredRange1, registeredRange2]);

    const decorationRegistry = mock(DecorationRegistry);
    when(decorationRegistry.issue(newPattern)).thenReturn(mockType<Decoration>({decorationType, pattern: newPattern}));
    when(decorationRegistry.inquireById('DECORATION_ID')).thenReturn(mockType<Decoration>({id: 'DECORATION_ID', decorationType}));

    suite('when the cursor is on highlight', () => {

        const editor = mockType<TextEditor>({id: 'EDITOR_ID', selection: {start: 11, end: 11}});
        const windowComponent = mockType<WindowComponent>({visibleTextEditors: [editor]});

        const command = new NextHighlightCommand(matchingModeRegistry, textLocationRegistry, decorationRegistry, windowComponent);

        test('takes you to the next highlight of the pattern', async () => {
            await command.execute(editor);
            assertEqual(editor.selection, {start: 30, end: 35});
        });
    });

    suite('when the cursor is NOT on highlight', () => {

        const editor = mockMethods<TextEditor>(['setDecorations'], {
            id: 'EDITOR_ID',
            selection: unregisteredRange,
            selectedText: 'TEXT',
            wholeText: 'abc TEXT defgh TEXT'
        });
        const windowComponent = mockType<WindowComponent>({visibleTextEditors: [editor]});

        const command = new NextHighlightCommand(matchingModeRegistry, textLocationRegistry, decorationRegistry, windowComponent);

        test('It highlights and take you to the next highlight', async () => {
            await command.execute(editor);

            verify(editor.setDecorations(decorationType, [{start: 4, end: 8}, {start: 15, end: 19}]));
            assertEqual(editor.selection, {start: 15, end: 19});
        });
    });
});
