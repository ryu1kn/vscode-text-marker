import TextEditor from '../../../lib/text-editor';
import {mock, mockMethods, mockType, verify, when} from '../../helpers/mock';
import TextLocationRegistry from '../../../lib/text-location-registry';
import {GoToNextHighlightCommand} from '../../../lib/commands/go-to-next-highlight';
import MatchingModeRegistry from '../../../lib/matching-mode-registry';
import StringPattern from '../../../lib/pattern/string';
import {TextEditorDecorationType} from 'vscode';
import DecorationRegistry from '../../../lib/decoration/decoration-registry';
import {Decoration} from '../../../lib/entities/decoration';
import WindowComponent from '../../../lib/editor-components/window';
import * as assert from 'assert';

suite('Go-to-next-highlight command', function () {

    const matchingModeRegistry = mockType<MatchingModeRegistry>();

    const registeredRange1 = {start: 10, end: 15};
    const registeredRange2 = {start: 30, end: 35};
    const registeredRange3 = {start: 40, end: 45};
    const unregisteredRange = {start: 15, end: 19};

    const newPattern = new StringPattern({phrase: 'TEXT'});
    const decorationType = mockType<TextEditorDecorationType>();

    const textLocationRegistry = new TextLocationRegistry();
    textLocationRegistry.register('EDITOR_ID', 'DECORATION_ID', [registeredRange1, registeredRange2, registeredRange3]);

    const decorationRegistry = mock(DecorationRegistry);
    when(decorationRegistry.issue(newPattern)).thenReturn(mockType<Decoration>({decorationType, pattern: newPattern}));
    when(decorationRegistry.inquireById('DECORATION_ID')).thenReturn(mockType<Decoration>({id: 'DECORATION_ID', decorationType}));

    suite('when the cursor is on a highlight and not the last one of the same pattern', () => {

        const editor = mockType<TextEditor>({id: 'EDITOR_ID', selection: {start: 31, end: 31}});
        const windowComponent = mockType<WindowComponent>({visibleTextEditors: [editor]});

        const command = new GoToNextHighlightCommand(matchingModeRegistry, textLocationRegistry, decorationRegistry, windowComponent);

        test('takes you to the next highlight of the pattern', async () => {
            await command.execute(editor);
            assert.deepEqual(editor.selection, {start: 40, end: 45});
        });
    });

    suite('when the cursor is on a highlight and the last one of the same pattern', () => {

        const editor = mockType<TextEditor>({id: 'EDITOR_ID', selection: {start: 41, end: 41}});
        const windowComponent = mockType<WindowComponent>({visibleTextEditors: [editor]});

        const command = new GoToNextHighlightCommand(matchingModeRegistry, textLocationRegistry, decorationRegistry, windowComponent);

        test('takes you to the first highlight of the pattern', async () => {
            await command.execute(editor);
            assert.deepEqual(editor.selection, {start: 10, end: 15});
        });
    });

    suite('when the cursor is NOT on highlight', () => {

        const editor = mockMethods<TextEditor>(['setDecorations'], {
            id: 'EDITOR_ID',
            selection: unregisteredRange,
            selectedText: 'TEXT',
            wholeText: 'abc TEXT defgh TEXT ijkl TEXT'
        });
        const windowComponent = mockType<WindowComponent>({visibleTextEditors: [editor]});

        const command = new GoToNextHighlightCommand(matchingModeRegistry, textLocationRegistry, decorationRegistry, windowComponent);

        test('It highlights and take you to the next highlight', async () => {
            await command.execute(editor);

            verify(editor.setDecorations(decorationType, [{start: 4, end: 8}, unregisteredRange, {start: 25, end: 29}]));
            assert.deepEqual(editor.selection, {start: 25, end: 29});
        });
    });
});
