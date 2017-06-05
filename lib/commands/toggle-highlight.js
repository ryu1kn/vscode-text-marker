
class ToggleHighlightCommand {

    constructor(params) {
        this._logger = params.logger;
        this._decorationOperatorFactory = params.decorationOperatorFactory;
        this._patternFactory = params.patternFactory;
        this._textEditorFactory = params.textEditorFactory;
        this._textLocationRegistry = params.textLocationRegistry;
        this._windowComponent = params.windowComponent;
    }

    execute(editor) {
        try {
            const textEditor = this._textEditorFactory.create(editor);
            const decorationId = this._textLocationRegistry.queryDecorationId({
                editorId: textEditor.id,
                offset: textEditor.cursorOffset
            });
            if (decorationId) {
                this._removeDecoration(decorationId);
            } else {
                this._addDecoration(textEditor);
            }
        } catch (e) {
            this._handleError(e);
        }
    }

    _removeDecoration(decorationId) {
        const visibleEditors = this._windowComponent.visibleTextEditors;
        const decorationOperator = this._decorationOperatorFactory.create(visibleEditors);
        decorationOperator.removeDecoration(decorationId);
    }

    _addDecoration(textEditor) {
        if (!textEditor.selectedText) return;
        const visibleEditors = this._windowComponent.visibleTextEditors;
        const decorationOperator = this._decorationOperatorFactory.create(visibleEditors);
        const pattern = this._patternFactory.create({phrase: textEditor.selectedText});
        decorationOperator.addDecoration(pattern);
    }

    _handleError(e) {
        this._logger.error(e.stack);
    }

}

module.exports = ToggleHighlightCommand;
