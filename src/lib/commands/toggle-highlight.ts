import DecorationOperatorFactory from '../decoration-operator-factory';
import PatternFactory from '../pattern-factory';
import TextEditorFactory from '../text-editor-factory';
import TextLocationRegistry from '../text-location-registry';
import * as vscode from 'vscode';
import TextEditor from '../text-editor';

export default class ToggleHighlightCommand {
    private readonly decorationOperatorFactory: DecorationOperatorFactory;
    private readonly patternFactory: PatternFactory;
    private readonly textEditorFactory: TextEditorFactory;
    private readonly textLocationRegistry: TextLocationRegistry;

    constructor(decorationOperatorFactory: DecorationOperatorFactory,
                patternFactory: PatternFactory,
                textEditorFactory: TextEditorFactory,
                textLocationRegistry: TextLocationRegistry) {
        this.decorationOperatorFactory = decorationOperatorFactory;
        this.patternFactory = patternFactory;
        this.textEditorFactory = textEditorFactory;
        this.textLocationRegistry = textLocationRegistry;
    }

    execute(editor: vscode.TextEditor) {
        const textEditor = this.textEditorFactory.create(editor);
        const decorationId = this.textLocationRegistry.queryDecorationId(textEditor.id, textEditor.selection);
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
