
// TODO: consider selectionS
export default class SelectedTextFinder {

    find(editor) {
        const selectedText = this._getSelectedText(editor);
        return selectedText ? selectedText : this._getWordUnderCursor(editor);
    }

    _getSelectedText(editor) {
        return editor.document.getText(editor.selection);
    }

    _getWordUnderCursor(editor) {
        const wordRange = editor.document.getWordRangeAtPosition(editor.selection.active);
        return wordRange && editor.document.getText(wordRange);
    }

}
