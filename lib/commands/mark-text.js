
class MarkTextCommand {

    constructor(params) {
        this._decorationOperatorFactory = params.decorationOperatorFactory;
        this._patternFactory = params.patternFactory;
        this._textEditorFactory = params.textEditorFactory;
        this._windowComponent = params.windowComponent;
    }

    execute(editor) {
        const textEditor = this._textEditorFactory.create(editor);
        if (!textEditor.selectedText) return;

        const visibleEditors = this._windowComponent.visibleTextEditors;
        const decorationOperator = this._decorationOperatorFactory.create(visibleEditors);
        const pattern = this._patternFactory.create({phrase: textEditor.selectedText});
        decorationOperator.toggleDecoration(pattern);
    }

}

module.exports = MarkTextCommand;
