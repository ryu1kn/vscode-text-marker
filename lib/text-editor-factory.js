
const TextEditor = require('./text-editor');

class TextEditorFactory {

    constructor(params) {
        this._VsRange = params.VsRange;
    }

    create(editor) {
        return new TextEditor({
            editor,
            VsRange: this._VsRange
        });
    }

}

module.exports = TextEditorFactory;
