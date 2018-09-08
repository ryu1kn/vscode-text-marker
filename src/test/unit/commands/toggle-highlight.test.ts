import {any, mock, mockMethods, mockType, verify, when} from '../../helpers/mock';

import ToggleHighlightCommand from '../../../lib/commands/toggle-highlight';
import TextEditor from '../../../lib/text-editor';
import TextLocationRegistry from '../../../lib/text-location-registry';
import MatchingModeRegistry from '../../../lib/matching-mode-registry';
import DecorationRegistry from '../../../lib/decoration-registry';
import WindowComponent from '../../../lib/editor-components/window';
import StringPattern from '../../../lib/pattern/string';
import {Decoration} from '../../../lib/entities/decoration';
import {TextEditorDecorationType} from 'vscode';
import {some} from 'fp-ts/lib/Option';

suite('ToggleHighlightCommand', () => {

    const matchingModeRegistry = mockType<MatchingModeRegistry>();

    const registeredRange = {start: 10, end: 20};
    const unregisteredRange = {start: 0, end: 0};

    const newPattern = new StringPattern({phrase: 'SELECTED'});
    const knownPattern = new StringPattern({phrase: 'SELECTED_KNOWN'});
    const decorationType = mockType<TextEditorDecorationType>();

    const textLocationRegistry = new TextLocationRegistry();
    textLocationRegistry.register('EDITOR_ID', 'DECORATION_ID', [registeredRange]);

    const decorationRegistry = mock(DecorationRegistry);
    when(decorationRegistry.issue(newPattern)).thenReturn(mockType<Decoration>({decorationType, pattern: newPattern}));
    when(decorationRegistry.issue(knownPattern)).thenReturn(null);
    when(decorationRegistry.inquireById('DECORATION_ID')).thenReturn(some(mockType<Decoration>({id: 'DECORATION_ID', decorationType})));

    suite('When text is selected', () => {

        test('it decorates a selected text if the cursor is not on highlight', () => {
            const editor = mockMethods<TextEditor>(['setDecorations'], {
                id: 'EDITOR_ID',
                selectedText: 'SELECTED',
                selection: unregisteredRange,
                wholeText: 'abc SELECTED def'
            });

            const command = new ToggleHighlightCommand(
                matchingModeRegistry,
                textLocationRegistry,
                decorationRegistry,
                mockType<WindowComponent>({visibleTextEditors: [editor]})
            );
            command.execute(editor);

            verify(editor.setDecorations(decorationType, [{start: 4, end: 12}]));
        });

        test('it remove decoration if the cursor is on highlight', () => {
            const editor = mockMethods<TextEditor>(['unsetDecorations'], {
                id: 'EDITOR_ID',
                selectedText: 'SELECTED_KNOWN',
                selection: registeredRange,
                wholeText: 'abc SELECTED def'
            });

            const command = new ToggleHighlightCommand(
                matchingModeRegistry,
                textLocationRegistry,
                decorationRegistry,
                mockType<WindowComponent>({visibleTextEditors: [editor]})
            );
            command.execute(editor);

            verify(editor.unsetDecorations(decorationType));
        });
    });

    suite('When text is NOT selected', () => {

        const editor = mockMethods<TextEditor>(['setDecorations', 'unsetDecorations'], {
            id: 'EDITOR_ID',
            selectedText: '',
            selection: unregisteredRange
        });

        const command = new ToggleHighlightCommand(
            matchingModeRegistry,
            textLocationRegistry,
            decorationRegistry,
            mockType<WindowComponent>({visibleTextEditors: [editor]})
        );

        test('it does nothing', () => {
            command.execute(editor);

            verify(editor.setDecorations(any(), any()), {times: 0});
            verify(editor.unsetDecorations(any()), {times: 0});
        });
    });
});
