
const SelectedTextFinder = require('./selected-text-finder');

class TextEditor {

    constructor(params) {
        this._editor = params.editor;
        this._selectedTextFinder = new SelectedTextFinder();
        this._VsRange = params.VsRange;
    }

    get id() {
        return this._editor.document.uri.toString();
    }

    get selectedText() {
        return this._selectedTextFinder.find(this._editor);
    }

    get wholeText() {
        return this._editor.document.getText();
    }

    get cursorOffset() {
        if (!this._editor.selection.isEmpty) return null;
        return this._editor.document.offsetAt(this._editor.selection.active);
    }

    setDecorations(decorationType, ranges) {
        const vsRanges = ranges.map(range =>
            new this._VsRange(
                this._editor.document.positionAt(range.start),
                this._editor.document.positionAt(range.end)
            )
        );
        this._editor.setDecorations(decorationType, vsRanges);
    }

}

module.exports = TextEditor;
