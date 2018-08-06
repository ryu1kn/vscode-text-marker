import TextEditor from './text-editor';
import * as vscode from 'vscode';

export default class TextEditorFactory {

    create(editor: vscode.TextEditor) {
        return new TextEditor(editor);
    }

}
