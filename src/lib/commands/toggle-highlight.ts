
export default class ToggleHighlightCommand {
    private readonly decorationOperatorFactory: any;
    private readonly patternFactory: any;
    private readonly textEditorFactory: any;
    private readonly textLocationRegistry: any;

    constructor(params) {
        this.decorationOperatorFactory = params.decorationOperatorFactory;
        this.patternFactory = params.patternFactory;
        this.textEditorFactory = params.textEditorFactory;
        this.textLocationRegistry = params.textLocationRegistry;
    }

    execute(editor) {
        const textEditor = this.textEditorFactory.create(editor);
        const decorationId = this.textLocationRegistry.queryDecorationId({
            editorId: textEditor.id,
            flatRange: textEditor.flatRange
        });
        if (decorationId) {
            this.removeDecoration(decorationId);
        } else {
            this.addDecoration(textEditor);
        }
    }

    private removeDecoration(decorationId) {
        const decorationOperator = this.decorationOperatorFactory.createForVisibleEditors();
        decorationOperator.removeDecoration(decorationId);
    }

    private addDecoration(textEditor) {
        if (!textEditor.selectedText) return;
        const decorationOperator = this.decorationOperatorFactory.createForVisibleEditors();
        const pattern = this.patternFactory.create({phrase: textEditor.selectedText});
        decorationOperator.addDecoration(pattern);
    }

}
