
const TextEditor = require('./text-editor');

class TextEditorFactory {

    create(editor) {
        return new TextEditor({editor});
    }

}

module.exports = TextEditorFactory;
