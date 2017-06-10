
class HighlightCommand {

    constructor(params) {
        this._decorationOperatorFactory = params.decorationOperatorFactory;
        this._patternFactory = params.patternFactory;
        this._textEditorFactory = params.textEditorFactory;
    }

    execute(editor) {
        const textEditor = this._textEditorFactory.create(editor);
        if (!textEditor.selectedText) return;

        const decorationOperator = this._decorationOperatorFactory.createForVisibleEditors();
        const pattern = this._patternFactory.create({phrase: textEditor.selectedText});
        decorationOperator.addDecoration(pattern);
    }

}

module.exports = HighlightCommand;
