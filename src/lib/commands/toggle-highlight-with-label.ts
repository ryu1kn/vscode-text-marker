import DecorationOperatorFactory from '../decoration/decoration-operator-factory';
import PatternFactory from '../pattern/pattern-factory';
import TextLocationRegistry from '../text-location-registry';
import TextEditor from '../vscode/text-editor';
import {CommandLike} from '../vscode/vscode';
import MatchingModeRegistry from '../matching-mode-registry';
import DecorationRegistry from '../decoration/decoration-registry';
import WindowComponent from '../vscode/window';
import {DecorationTypeRegistry} from '../decoration/decoration-type-registry';
import * as O from 'fp-ts/lib/Option';

export default class ToggleHighlightWithLabelCommand implements CommandLike {
    private readonly decorationOperatorFactory: DecorationOperatorFactory;
    private readonly patternFactory: PatternFactory;
    private readonly textLocationRegistry: TextLocationRegistry;
    private readonly windowComponent: WindowComponent;

    constructor(matchingModeRegistry: MatchingModeRegistry,
                textLocationRegistry: TextLocationRegistry,
                decorationRegistry: DecorationRegistry,
                decorationTypeRegistry: DecorationTypeRegistry,
                windowComponent: WindowComponent) {
        this.decorationOperatorFactory = new DecorationOperatorFactory(decorationRegistry, decorationTypeRegistry, textLocationRegistry, windowComponent);
        this.patternFactory = new PatternFactory(matchingModeRegistry);
        this.textLocationRegistry = textLocationRegistry;
        this.windowComponent = windowComponent;
    }

    async execute(textEditor: TextEditor) {
        const existingId = this.textLocationRegistry.queryDecorationId(textEditor.id, textEditor.selection);
        if (O.isSome(existingId)) {
            const decorationOperator = this.decorationOperatorFactory.createForVisibleEditors();
            decorationOperator.removeDecoration(existingId.value);
            return;
        }

        await this.addDecorationWithLabel(textEditor);
    }

    private async addDecorationWithLabel(textEditor: TextEditor) {
        if (!textEditor.selectedText) return;

        const labelOption = await this.windowComponent.showInputBox({
            prompt: 'Enter a label for this highlight',
            placeHolder: 'e.g. transaction_id'
        })();

        if (O.isNone(labelOption)) return;

        const pattern = this.patternFactory.create({phrase: textEditor.selectedText});
        const decorationOperator = this.decorationOperatorFactory.createForVisibleEditors();
        decorationOperator.addDecoration(pattern, undefined, labelOption.value);
    }
}
