
export default class UpdateHighlightCommand {
    private readonly _decorationOperatorFactory: any;
    private readonly _decorationRegistry: any;
    private readonly _patternVariationReader: any;
    private readonly _textEditorFactory: any;
    private readonly _textLocationRegistry: any;

    constructor(params) {
        this._decorationOperatorFactory = params.decorationOperatorFactory;
        this._decorationRegistry = params.decorationRegistry;
        this._patternVariationReader = params.patternVariationReader;
        this._textEditorFactory = params.textEditorFactory;
        this._textLocationRegistry = params.textLocationRegistry;
    }

    async execute(editor) {
        const textEditor = this._textEditorFactory.create(editor);
        const decorationId = this._textLocationRegistry.queryDecorationId({
            editorId: textEditor.id,
            flatRange: textEditor.flatRange
        });
        if (!decorationId) return;

        const pattern = this._decorationRegistry.inquireById(decorationId).pattern;
        const newPattern = await this._patternVariationReader.read(pattern);
        if (!newPattern) return;

        const decorationOperator = this._decorationOperatorFactory.createForVisibleEditors();
        decorationOperator.updateDecorationPattern(decorationId, newPattern);
    }

}
