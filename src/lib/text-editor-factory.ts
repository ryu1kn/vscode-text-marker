import TextEditor from './text-editor';
import {CreateRange} from './editor-components/vscode';
import * as vscode from 'vscode';

export default class TextEditorFactory {
    private readonly createRange: CreateRange;

    constructor(createRange: CreateRange) {
        this.createRange = createRange;
    }

    create(editor: vscode.TextEditor) {
        return new TextEditor(editor, this.createRange);
    }

}
