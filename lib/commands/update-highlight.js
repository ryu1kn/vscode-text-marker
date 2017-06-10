
class UpdateHighlightCommand {

    constructor(params) {
        this._decorationOperatorFactory = params.decorationOperatorFactory;
        this._decorationVariationReader = params.decorationVariationReader;
        this._textEditorFactory = params.textEditorFactory;
        this._textLocationRegistry = params.textLocationRegistry;
    }

    execute(editor) {
        const textEditor = this._textEditorFactory.create(editor);
        const decorationId = this._textLocationRegistry.queryDecorationId({
            editorId: textEditor.id,
            offset: textEditor.cursorOffset
        });
        return this._decorationVariationReader.read(decorationId)
            .then(newDecoration => {
                const decorationOperator = this._decorationOperatorFactory.createForVisibleEditors();
                decorationOperator.updateDecoration(newDecoration);
            });
    }

}

module.exports = UpdateHighlightCommand;
