
export default class ToggleHighlightCommand {
    private readonly _decorationOperatorFactory: any;
    private readonly _patternFactory: any;
    private readonly _textEditorFactory: any;
    private readonly _textLocationRegistry: any;

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
            this.removeDecoration(decorationId);
        } else {
            this.addDecoration(textEditor);
        }
    }

    private removeDecoration(decorationId) {
        const decorationOperator = this._decorationOperatorFactory.createForVisibleEditors();
        decorationOperator.removeDecoration(decorationId);
    }

    private addDecoration(textEditor) {
        if (!textEditor.selectedText) return;
        const decorationOperator = this._decorationOperatorFactory.createForVisibleEditors();
        const pattern = this._patternFactory.create({phrase: textEditor.selectedText});
        decorationOperator.addDecoration(pattern);
    }

}
