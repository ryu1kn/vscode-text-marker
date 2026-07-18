import * as assert from 'assert';
import {any, mock, mockMethods, mockType, verify, when} from '../../helpers/mock';

import ToggleHighlightWithLabelCommand from '../../../lib/commands/toggle-highlight-with-label';
import TextEditor from '../../../lib/vscode/text-editor';
import TextLocationRegistry from '../../../lib/text-location-registry';
import MatchingModeRegistry from '../../../lib/matching-mode-registry';
import DecorationRegistry from '../../../lib/decoration/decoration-registry';
import WindowComponent from '../../../lib/vscode/window';
import StringPattern from '../../../lib/pattern/string';
import {Decoration} from '../../../lib/entities/decoration';
import {TextEditorDecorationType} from 'vscode';
import {none, some} from 'fp-ts/lib/Option';
import {task} from 'fp-ts/lib/Task';
import {DecorationTypeRegistry} from '../../../lib/decoration/decoration-type-registry';

suite('ToggleHighlightWithLabelCommand', () => {

    const matchingModeRegistry = mockType<MatchingModeRegistry>();

    const registeredRange = {start: 10, end: 20};
    const unregisteredRange = {start: 0, end: 0};

    const newPattern = new StringPattern({phrase: 'SELECTED'});

    const decorationType = mockType<TextEditorDecorationType>();

    const textLocationRegistry = new TextLocationRegistry();
    textLocationRegistry.register('EDITOR_ID', 'DECORATION_ID', [registeredRange]);

    const decorationRegistry = mock(DecorationRegistry);
    when(decorationRegistry.issue(newPattern, undefined, 'transaction_id'))
        .thenReturn(some(mockType<Decoration>({pattern: newPattern, label: 'transaction_id'})));
    when(decorationRegistry.inquireById('DECORATION_ID')).thenReturn(some(mockType<Decoration>({id: 'DECORATION_ID'})));

    const decorationTypeRegistry = mock(DecorationTypeRegistry);
    when(decorationTypeRegistry.provideFor(any())).thenReturn(decorationType);
    when(decorationTypeRegistry.inquire('DECORATION_ID')).thenReturn(some(decorationType));

    suite('When the cursor is not on a highlight and text is selected', () => {

        test('it asks for a label and decorates the selected text with it', async () => {
            const editor = mockMethods<TextEditor>(['setDecorations'], {
                id: 'EDITOR_ID',
                selectedText: 'SELECTED',
                selection: unregisteredRange,
                wholeText: 'abc SELECTED def'
            });

            const windowComponent = mockType<WindowComponent>({
                visibleTextEditors: [editor],
                showInputBox: () => task.of(some('transaction_id'))
            });

            const command = new ToggleHighlightWithLabelCommand(
                matchingModeRegistry,
                textLocationRegistry,
                decorationRegistry,
                decorationTypeRegistry,
                windowComponent
            );
            await command.execute(editor);

            verify(editor.setDecorations(decorationType, [{start: 4, end: 12}], 'transaction_id'));
        });

        test('it does nothing if the label prompt is cancelled', async () => {
            const editor = mockMethods<TextEditor>(['setDecorations'], {
                id: 'EDITOR_ID',
                selectedText: 'SELECTED',
                selection: unregisteredRange,
                wholeText: 'abc SELECTED def'
            });

            const windowComponent = mockType<WindowComponent>({
                visibleTextEditors: [editor],
                showInputBox: () => task.of(none)
            });

            const command = new ToggleHighlightWithLabelCommand(
                matchingModeRegistry,
                textLocationRegistry,
                decorationRegistry,
                decorationTypeRegistry,
                windowComponent
            );
            await command.execute(editor);

            verify(editor.setDecorations(any(), any(), any()), {times: 0});
        });
    });

    suite('When the cursor is on a highlight', () => {

        test('it removes the decoration without prompting for a label', async () => {
            const editor = mockMethods<TextEditor>(['unsetDecorations'], {
                id: 'EDITOR_ID',
                selectedText: 'SELECTED_KNOWN',
                selection: registeredRange,
                wholeText: 'abc SELECTED def'
            });

            let promptShown = false;
            const windowComponent = mockType<WindowComponent>({
                visibleTextEditors: [editor],
                showInputBox: () => {
                    promptShown = true;
                    return task.of(some('unexpected'));
                }
            });

            const command = new ToggleHighlightWithLabelCommand(
                matchingModeRegistry,
                textLocationRegistry,
                decorationRegistry,
                decorationTypeRegistry,
                windowComponent
            );
            await command.execute(editor);

            verify(editor.unsetDecorations(decorationType));
            assert.strictEqual(promptShown, false);
        });
    });

    suite('When text is NOT selected', () => {

        const editor = mockMethods<TextEditor>(['setDecorations', 'unsetDecorations'], {
            id: 'EDITOR_ID',
            selectedText: '',
            selection: unregisteredRange
        });

        const windowComponent = mockType<WindowComponent>({
            visibleTextEditors: [editor],
            showInputBox: () => task.of(some('transaction_id'))
        });

        const command = new ToggleHighlightWithLabelCommand(
            matchingModeRegistry,
            textLocationRegistry,
            decorationRegistry,
            decorationTypeRegistry,
            windowComponent
        );

        test('it does nothing', async () => {
            await command.execute(editor);

            verify(editor.setDecorations(any(), any(), any()), {times: 0});
            verify(editor.unsetDecorations(any()), {times: 0});
        });
    });
});
