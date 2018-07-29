import DecorationOperatorFactory from '../decoration-operator-factory';
import DecorationRegistry from '../decoration-registry';
import PatternVariationReader from '../pattern-variation-reader';
import TextEditorFactory from '../text-editor-factory';
import TextLocationRegistry from '../text-location-registry';

export default class UpdateHighlightCommand {
    private readonly decorationOperatorFactory: DecorationOperatorFactory;
    private readonly decorationRegistry: DecorationRegistry;
    private readonly patternVariationReader: PatternVariationReader;
    private readonly textEditorFactory: TextEditorFactory;
    private readonly textLocationRegistry: TextLocationRegistry;

    constructor(decorationOperatorFactory, decorationRegistry, patternVariationReader, textEditorFactory, textLocationRegistry) {
        this.decorationOperatorFactory = decorationOperatorFactory;
        this.decorationRegistry = decorationRegistry;
        this.patternVariationReader = patternVariationReader;
        this.textEditorFactory = textEditorFactory;
        this.textLocationRegistry = textLocationRegistry;
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
