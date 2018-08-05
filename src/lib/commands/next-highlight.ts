import {CommandLike} from '../editor-components/vscode';
import TextLocationRegistry from '../text-location-registry';
import TextEditor from '../text-editor';
import DecorationRegistry from '../decoration-registry';
import WindowComponent from '../editor-components/window';
import DecorationOperatorFactory from '../decoration-operator-factory';
import PatternFactory from '../pattern-factory';
import MatchingModeRegistry from '../matching-mode-registry';

export class NextHighlightCommand implements CommandLike {
    private readonly textLocationRegistry: TextLocationRegistry;
    private readonly decorationOperatorFactory: DecorationOperatorFactory;
    private readonly patternFactory: PatternFactory;

    constructor(matchingModeRegistry: MatchingModeRegistry,
                textLocationRegistry: TextLocationRegistry,
                decorationRegistry: DecorationRegistry,
                windowComponent: WindowComponent) {
        this.decorationOperatorFactory = new DecorationOperatorFactory(decorationRegistry, textLocationRegistry, windowComponent);
        this.textLocationRegistry = textLocationRegistry;
        this.patternFactory = new PatternFactory(matchingModeRegistry);
    }

    execute(editor: TextEditor) {
        const decorationId = this.textLocationRegistry.queryDecorationId(editor.id, editor.selection).toUndefined();
        if (!decorationId) {
            this.addDecoration(editor);
        }
        const next = this.textLocationRegistry.findNextOccurence(editor.id, editor.selection);
        next.map(range => { editor.selection = range; });
    }

    private addDecoration(textEditor: TextEditor) {
        if (!textEditor.selectedText) return;
        const pattern = this.patternFactory.create({phrase: textEditor.selectedText});
        const decorationOperator = this.decorationOperatorFactory.createForVisibleEditors();
        decorationOperator.addDecoration(pattern);
    }
}
