// TODO: consider selectionS
import {TextEditor as VsTextEditor} from 'vscode';

export default class SelectedTextFinder {

    find(editor: VsTextEditor) {
        const selectedText = this.getSelectedText(editor);
        return selectedText ? selectedText : this.getWordUnderCursor(editor);
    }

    private getSelectedText(editor: VsTextEditor) {
        return editor.document.getText(editor.selection);
    }

    private getWordUnderCursor(editor: VsTextEditor) {
        const wordRange = editor.document.getWordRangeAtPosition(editor.selection.active);
        return wordRange && editor.document.getText(wordRange);
    }

}
