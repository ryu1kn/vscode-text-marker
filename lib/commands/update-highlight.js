
class UpdateHighlightCommand {

    constructor(params) {
        this._decorationOperatorFactory = params.decorationOperatorFactory;
        this._decorationRegistry = params.decorationRegistry;
        this._patternVariationReader = params.patternVariationReader;
        this._textEditorFactory = params.textEditorFactory;
        this._textLocationRegistry = params.textLocationRegistry;
    }

    execute(editor) {
        const textEditor = this._textEditorFactory.create(editor);
        const decorationId = this._textLocationRegistry.queryDecorationId({
            editorId: textEditor.id,
            offset: textEditor.cursorOffset
        });
        if (!decorationId) return;

        const pattern = this._decorationRegistry.inquireById(decorationId).pattern;
        return this._patternVariationReader.read(pattern)
            .then(newPattern => {
                if (!newPattern) return;
                const decorationOperator = this._decorationOperatorFactory.createForVisibleEditors();
                decorationOperator.updateDecorationPattern(decorationId, newPattern);
            });
    }

}

module.exports = UpdateHighlightCommand;
