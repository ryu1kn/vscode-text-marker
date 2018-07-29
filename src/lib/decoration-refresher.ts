
export default class DecorationRefresher {
    private readonly logger: any;
    private readonly decorationOperatorFactory: any;
    private readonly debouncer: any;
    private readonly textEditorFactory: any;
    private readonly windowComponent: any;

    constructor(params) {
        this.logger = params.logger;
        this.decorationOperatorFactory = params.decorationOperatorFactory;
        this.debouncer = params.debouncer;
        this.textEditorFactory = params.textEditorFactory;
        this.windowComponent = params.windowComponent;
    }

    refresh(editor) {
        if (!editor) return;
        try {
            const textEditor = this.textEditorFactory.create(editor);
            this._refresh(textEditor);
        } catch (e) {
            this.handleError(e);
        }
    }

    private _refresh(editor) {
        const decorationOperator = this.decorationOperatorFactory.create([editor]);
        decorationOperator.refreshDecorations();
    }

    refreshWithDelay(_documentChangeEvent) {
        try {
            const editor = this.windowComponent.activeTextEditor;
            this.debouncer.debounce(() => {
                try {
                    if (editor) this._refresh(editor);
                } catch (e) {
                    this.handleError(e);
                }
            });
        } catch (e) {
            this.handleError(e);
        }
    }

    private handleError(e) {
        this.logger.error(e.stack);
    }

}
