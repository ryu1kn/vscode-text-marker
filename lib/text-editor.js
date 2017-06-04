
const SelectedTextFinder = require('./selected-text-finder');

class TextEditor {

    constructor({editor}) {
        this._editor = editor;
        this._selectedTextFinder = new SelectedTextFinder();
    }

    get selectedText() {
        return this._selectedTextFinder.find(this._editor);
    }

}

module.exports = TextEditor;
