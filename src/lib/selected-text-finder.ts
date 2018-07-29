
// TODO: consider selectionS
export default class SelectedTextFinder {

    find(editor) {
        const selectedText = this.getSelectedText(editor);
        return selectedText ? selectedText : this.getWordUnderCursor(editor);
    }

    private getSelectedText(editor) {
        return editor.document.getText(editor.selection);
    }

    private getWordUnderCursor(editor) {
        const wordRange = editor.document.getWordRangeAtPosition(editor.selection.active);
        return wordRange && editor.document.getText(wordRange);
    }

}
