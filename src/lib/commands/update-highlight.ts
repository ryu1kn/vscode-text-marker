
export default class UpdateHighlightCommand {
    private readonly decorationOperatorFactory: any;
    private readonly decorationRegistry: any;
    private readonly patternVariationReader: any;
    private readonly textEditorFactory: any;
    private readonly textLocationRegistry: any;

    constructor(params) {
        this.decorationOperatorFactory = params.decorationOperatorFactory;
        this.decorationRegistry = params.decorationRegistry;
        this.patternVariationReader = params.patternVariationReader;
        this.textEditorFactory = params.textEditorFactory;
        this.textLocationRegistry = params.textLocationRegistry;
    }

    async execute(editor) {
        const textEditor = this.textEditorFactory.create(editor);
        const decorationId = this.textLocationRegistry.queryDecorationId({
            editorId: textEditor.id,
            flatRange: textEditor.flatRange
        });
        if (!decorationId) return;

        const pattern = this.decorationRegistry.inquireById(decorationId).pattern;
        const newPattern = await this.patternVariationReader.read(pattern);
        if (!newPattern) return;

        const decorationOperator = this.decorationOperatorFactory.createForVisibleEditors();
        decorationOperator.updateDecorationPattern(decorationId, newPattern);
    }

}
