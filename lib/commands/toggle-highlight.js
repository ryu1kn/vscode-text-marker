
class ToggleHighlightCommand {

    constructor(params) {
        this._decorationOperatorFactory = params.decorationOperatorFactory;
        this._patternFactory = params.patternFactory;
        this._textEditorFactory = params.textEditorFactory;
        this._textLocationRegistry = params.textLocationRegistry;
    }

    execute(editor) {
        const textEditor = this._textEditorFactory.create(editor);
        const decorationId = this._textLocationRegistry.queryDecorationId({
            editorId: textEditor.id,
            flatRange: textEditor.flatRange
        });
        if (decorationId) {
            this._removeDecoration(decorationId);
        } else {
            this._addDecoration(textEditor);
        }
    }

    _removeDecoration(decorationId) {
        const decorationOperator = this._decorationOperatorFactory.createForVisibleEditors();
        decorationOperator.removeDecoration(decorationId);
    }

    _addDecoration(textEditor) {
        if (!textEditor.selectedText) return;
        const decorationOperator = this._decorationOperatorFactory.createForVisibleEditors();
        const pattern = this._patternFactory.create({phrase: textEditor.selectedText});
        decorationOperator.addDecoration(pattern);
    }

}

module.exports = ToggleHighlightCommand;
