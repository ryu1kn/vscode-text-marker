import {CommandLike} from '../editor-components/vscode';
import TextLocationRegistry from '../text-location-registry';
import TextEditor from '../text-editor';
import DecorationRegistry from '../decoration/decoration-registry';
import WindowComponent from '../editor-components/window';
import DecorationOperatorFactory from '../decoration/decoration-operator-factory';
import PatternFactory from '../pattern/pattern-factory';
import MatchingModeRegistry from '../matching-mode-registry';
import {FlatRange} from '../models/flat-range';
import {Option} from 'fp-ts/lib/Option';

export abstract class GoToHighlightCommand implements CommandLike {
    protected readonly textLocationRegistry: TextLocationRegistry;
    private readonly decorationOperatorFactory: DecorationOperatorFactory;
    private readonly patternFactory: PatternFactory;

    protected abstract findTargetLocation(editor: TextEditor): Option<FlatRange>;

    protected constructor(matchingModeRegistry: MatchingModeRegistry,
                textLocationRegistry: TextLocationRegistry,
                decorationRegistry: DecorationRegistry,
                windowComponent: WindowComponent) {
        this.decorationOperatorFactory = new DecorationOperatorFactory(decorationRegistry, textLocationRegistry, windowComponent);
        this.textLocationRegistry = textLocationRegistry;
        this.patternFactory = new PatternFactory(matchingModeRegistry);
    }

    execute(editor: TextEditor) {
        const decorationId = this.textLocationRegistry.queryDecorationId(editor.id, editor.selection).toUndefined();
        if (!decorationId) this.addDecoration(editor);
        this.findTargetLocation(editor).map(range => { editor.selection = range; });
    }

    private addDecoration(textEditor: TextEditor) {
        if (!textEditor.selectedText) return;
        const pattern = this.patternFactory.create({phrase: textEditor.selectedText});
        const decorationOperator = this.decorationOperatorFactory.createForVisibleEditors();
        decorationOperator.addDecoration(pattern);
    }
}
