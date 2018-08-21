import DecorationOperatorFactory from '../decoration-operator-factory';
import DecorationRegistry from '../decoration-registry';
import PatternVariationReader from '../pattern-variation-reader';
import TextLocationRegistry from '../text-location-registry';
import {CommandLike} from '../editor-components/vscode';
import TextEditor from '../text-editor';

export default class UpdateHighlightCommand implements CommandLike {
    private readonly decorationOperatorFactory: DecorationOperatorFactory;
    private readonly decorationRegistry: DecorationRegistry;
    private readonly patternVariationReader: PatternVariationReader;
    private readonly textLocationRegistry: TextLocationRegistry;

    constructor(decorationOperatorFactory: DecorationOperatorFactory,
                decorationRegistry: DecorationRegistry,
                patternVariationReader: PatternVariationReader,
                textLocationRegistry: TextLocationRegistry) {
        this.decorationOperatorFactory = decorationOperatorFactory;
        this.decorationRegistry = decorationRegistry;
        this.patternVariationReader = patternVariationReader;
        this.textLocationRegistry = textLocationRegistry;
    }

    async execute(textEditor: TextEditor) {
        const decorationId = this.textLocationRegistry.queryDecorationId(textEditor.id, textEditor.selection).toUndefined();
        if (!decorationId) return;

        const pattern = this.decorationRegistry.inquireById(decorationId)!.pattern;
        const newPatternOpt = await this.patternVariationReader.read(pattern);
        return newPatternOpt.map(newPattern => {
            const decorationOperator = this.decorationOperatorFactory.createForVisibleEditors();
            decorationOperator.updateDecorationPattern(decorationId, newPattern);
        });
    }

}
