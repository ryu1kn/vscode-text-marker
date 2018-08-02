import {any, expect, mock, mockType, sinon, verify, when} from '../../helpers/helper';

import ToggleHighlightCommand from '../../../lib/commands/toggle-highlight';
import PatternFactory from '../../../lib/pattern-factory';
import DecorationOperatorFactory from "../../../lib/decoration-operator-factory";
import TextEditorFactory from "../../../lib/text-editor-factory";
import * as vscode from "vscode";
import TextEditor from "../../../lib/text-editor";
import TextLocationRegistry from "../../../lib/text-location-registry";
import RegexPattern from "../../../lib/patterns/regex";

suite('ToggleHighlightCommand', () => {

    const rawEditor = {} as vscode.TextEditor;

    suite('When text is selected', () => {
        const patternFactory = mock(PatternFactory);
        when(patternFactory.create({phrase: 'SELECTED'})).thenReturn('PATTERN');

        test('it decorates a selected text if the cursor is not on highlight', () => {
            const editor = {selectedText: 'SELECTED'} as TextEditor;
            const textEditorFactory = mock(TextEditorFactory);
            when(textEditorFactory.create(rawEditor)).thenReturn(editor);
            const textLocationRegistry = mock(TextLocationRegistry);
            when(textLocationRegistry.queryDecorationId(any(), any())).thenReturn(null);
            const decorationOperator = {addDecoration: sinon.spy()};
            const decorationOperatorFactory = mock(DecorationOperatorFactory);
            when(decorationOperatorFactory.createForVisibleEditors()).thenReturn(decorationOperator);
            const command = new ToggleHighlightCommand(
                decorationOperatorFactory,
                patternFactory,
                textEditorFactory,
                textLocationRegistry
            );
            command.execute(rawEditor);

            expect(decorationOperator.addDecoration).to.have.been.calledWith('PATTERN');
        });

        test('it remove decoration if the cursor is on highlight', () => {
            const editor = mockType<TextEditor>({selectedText: null});
            const decorationOperator = {removeDecoration: sinon.spy()};
            const decorationOperatorFactory = mock(DecorationOperatorFactory);
            when(decorationOperatorFactory.createForVisibleEditors()).thenReturn(decorationOperator);
            const textEditorFactory = mock(TextEditorFactory);
            when(textEditorFactory.create(rawEditor)).thenReturn(editor);
            const textLocationRegistry = mock(TextLocationRegistry);
            when(textLocationRegistry.queryDecorationId(any(), any())).thenReturn('DECORATION_ID');
            const command = new ToggleHighlightCommand(
                decorationOperatorFactory,
                patternFactory,
                textEditorFactory,
                textLocationRegistry
            );
            command.execute(rawEditor);

            expect(decorationOperator.removeDecoration).to.have.been.calledWith('DECORATION_ID');
        });
    });

    suite('When text is NOT selected', () => {
        const patternFactory = mock(PatternFactory);
        when(patternFactory.create(any())).thenReturn(mock(RegexPattern));

        const editor = mockType<TextEditor>({selectedText: null});
        const textEditorFactory = mock(TextEditorFactory);
        when(textEditorFactory.create(rawEditor)).thenReturn(editor);

        test('it does nothing if text is not selected', () => {
            const decorationOperatorFactory = mock(DecorationOperatorFactory);
            const textLocationRegistry = mock(TextLocationRegistry);
            when(textLocationRegistry.queryDecorationId(any(), any())).thenReturn(null);
            const command = new ToggleHighlightCommand(decorationOperatorFactory, patternFactory, textEditorFactory, textLocationRegistry);
            command.execute(rawEditor);

            verify(decorationOperatorFactory.createForVisibleEditors(), {times: 0});
        });
    });
});
