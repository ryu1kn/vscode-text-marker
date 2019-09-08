import DecorationOperatorFactory from '../decoration/decoration-operator-factory';
import PatternFactory from '../pattern/pattern-factory';
import TextLocationRegistry from '../text-location-registry';
import TextEditor from '../vscode/text-editor';
import {CommandLike} from '../vscode/vscode';
import MatchingModeRegistry from '../matching-mode-registry';
import DecorationRegistry from '../decoration/decoration-registry';
import WindowComponent from '../vscode/window';
import {DecorationTypeRegistry} from '../decoration/decoration-type-registry';
import {pipe} from 'fp-ts/lib/pipeable';
import * as O from 'fp-ts/lib/Option';

export default class ToggleHighlightCommand implements CommandLike {
    private readonly decorationOperatorFactory: DecorationOperatorFactory;
    private readonly patternFactory: PatternFactory;
    private readonly textLocationRegistry: TextLocationRegistry;

    constructor(matchingModeRegistry: MatchingModeRegistry,
                textLocationRegistry: TextLocationRegistry,
                decorationRegistry: DecorationRegistry,
                decorationTypeRegistry: DecorationTypeRegistry,
                windowComponent: WindowComponent) {
        this.decorationOperatorFactory = new DecorationOperatorFactory(decorationRegistry, decorationTypeRegistry, textLocationRegistry, windowComponent);
        this.patternFactory = new PatternFactory(matchingModeRegistry);
        this.textLocationRegistry = textLocationRegistry;
    }

    execute(textEditor: TextEditor) {
        pipe(
            this.textLocationRegistry.queryDecorationId(textEditor.id, textEditor.selection),
            O.fold(
                () => this.addDecoration(textEditor),
                decorationId => this.removeDecoration(decorationId)
            )
        );
    }

    private removeDecoration(decorationId: string) {
        const decorationOperator = this.decorationOperatorFactory.createForVisibleEditors();
        decorationOperator.removeDecoration(decorationId);
    }

    private addDecoration(textEditor: TextEditor) {
        if (!textEditor.selectedText) return;
        const pattern = this.patternFactory.create({phrase: textEditor.selectedText});
        const decorationOperator = this.decorationOperatorFactory.createForVisibleEditors();
        decorationOperator.addDecoration(pattern);
    }

}
