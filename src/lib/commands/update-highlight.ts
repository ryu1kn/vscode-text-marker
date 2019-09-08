import DecorationOperatorFactory from '../decoration/decoration-operator-factory';
import DecorationRegistry from '../decoration/decoration-registry';
import DecorationVariationReader from '../decoration/decoration-variation-reader';
import TextLocationRegistry from '../text-location-registry';
import {CommandLike} from '../vscode/vscode';
import TextEditor from '../vscode/text-editor';
import * as O from 'fp-ts/lib/Option';
import {getOptionT2v} from 'fp-ts/lib/OptionT';
import {task} from 'fp-ts/lib/Task';
import {pipe} from 'fp-ts/lib/pipeable';

export default class UpdateHighlightCommand implements CommandLike {
    private readonly decorationOperatorFactory: DecorationOperatorFactory;
    private readonly decorationRegistry: DecorationRegistry;
    private readonly patternVariationReader: DecorationVariationReader;
    private readonly textLocationRegistry: TextLocationRegistry;

    constructor(decorationOperatorFactory: DecorationOperatorFactory,
                decorationRegistry: DecorationRegistry,
                patternVariationReader: DecorationVariationReader,
                textLocationRegistry: TextLocationRegistry) {
        this.decorationOperatorFactory = decorationOperatorFactory;
        this.decorationRegistry = decorationRegistry;
        this.patternVariationReader = patternVariationReader;
        this.textLocationRegistry = textLocationRegistry;
    }

    async execute(textEditor: TextEditor) {
        const result = pipe(
            this.textLocationRegistry.queryDecorationId(textEditor.id, textEditor.selection),
            O.chain(decorationId => this.decorationRegistry.inquireById(decorationId)),
            O.map(decoration =>
                getOptionT2v(task).map(
                    this.patternVariationReader.read(decoration),
                    newDecoration => {
                        const decorationOperator = this.decorationOperatorFactory.createForVisibleEditors();
                        decorationOperator.updateDecoration(decoration, newDecoration);
                    }
                )
            )
        );
        return O.option.sequence(task)(result).run();
    }
}
