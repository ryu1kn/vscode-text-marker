import TextEditor from '../../lib/text-editor';
import {Position, Range, Selection, TextDocument, TextEditor as VsTextEditor, TextEditorRevealType} from 'vscode';
import {mockMethods, verify, when} from '../helpers/helper';
import {CreateRange} from '../../lib/editor-components/vscode';
import * as assert from 'assert';

suite('TextEditor', () => {
    const position1 = position(0, 0);
    const position2 = position(0, 5);

    const document = mockMethods<TextDocument>(['positionAt']);
    when(document.positionAt(0)).thenReturn(position1);
    when(document.positionAt(5)).thenReturn(position2);

    const createRange = (p1: Position, p2: Position) => ({start: p1, end: p2});

    const rawEditor = mockMethods<VsTextEditor>(['revealRange'], {document});

    const editor = new TextEditor(rawEditor, createRange as CreateRange);

    test('reveals the area if the given cursor position is out of visible area', () => {
        editor.selection = {start: 0, end: 5};
        assert.deepEqual(rawEditor.selection, range(position1, position2));
        verify(rawEditor.revealRange(selection(position1, position2), TextEditorRevealType.InCenterIfOutsideViewport));
    });

    function position(line: number, character: number): Position {
        return {line, character} as Position;
    }

    function selection(start: Position, end: Position): Selection {
        return {start, end} as Selection;
    }

    function range(start: Position, end: Position): Range {
        return {start, end} as Range;
    }
});
