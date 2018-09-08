import DecorationOperatorFactory from '../decoration/decoration-operator-factory';
import DecorationRegistry from '../decoration/decoration-registry';
import PatternVariationReader from '../pattern/pattern-variation-reader';
import TextLocationRegistry from '../text-location-registry';
import {CommandLike} from '../vscode/vscode';
import TextEditor from '../vscode/text-editor';
import {none} from 'fp-ts/lib/Option';

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

        const decorationOpt = this.decorationRegistry.inquireById(decorationId);
        return decorationOpt.fold(Promise.resolve(none), async decoration => {
            const newPatternOpt = await this.patternVariationReader.read(decoration.pattern);
            return newPatternOpt.map(newPattern => {
                const decorationOperator = this.decorationOperatorFactory.createForVisibleEditors();
                decorationOperator.updateDecorationPattern(decorationId, newPattern);
            });
        });
    }

}
