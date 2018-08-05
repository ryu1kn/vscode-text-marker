import DecorationOperatorFactory from '../decoration-operator-factory';
import PatternFactory from '../pattern-factory';
import TextLocationRegistry from '../text-location-registry';
import TextEditor from '../text-editor';
import {CommandLike} from '../editor-components/vscode';
import MatchingModeRegistry from '../matching-mode-registry';

export default class ToggleHighlightCommand implements CommandLike {
    private readonly decorationOperatorFactory: DecorationOperatorFactory;
    private readonly patternFactory: PatternFactory;
    private readonly textLocationRegistry: TextLocationRegistry;

    constructor(decorationOperatorFactory: DecorationOperatorFactory,
                matchingModeRegistry: MatchingModeRegistry,
                textLocationRegistry: TextLocationRegistry) {
        this.decorationOperatorFactory = decorationOperatorFactory;
        this.patternFactory = new PatternFactory(matchingModeRegistry);
        this.textLocationRegistry = textLocationRegistry;
    }

    execute(textEditor: TextEditor) {
        const decorationId = this.textLocationRegistry.queryDecorationId(textEditor.id, textEditor.selection).toUndefined();
        if (decorationId) {
            this.removeDecoration(decorationId);
        } else {
            this.addDecoration(textEditor);
        }
    }

    private removeDecoration(decorationId: string) {
        const decorationOperator = this.decorationOperatorFactory.createForVisibleEditors();
        decorationOperator.removeDecoration(decorationId);
    }

    private addDecoration(textEditor: TextEditor) {
        if (!textEditor.selectedText) return;
        const decorationOperator = this.decorationOperatorFactory.createForVisibleEditors();
        const pattern = this.patternFactory.create({phrase: textEditor.selectedText});
        decorationOperator.addDecoration(pattern);
    }

}
