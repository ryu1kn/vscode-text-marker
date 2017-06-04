
class DecorationRefresher {

    constructor(params) {
        this._logger = params.logger;
        this._decorationOperatorFactory = params.decorationOperatorFactory;
        this._debouncer = params.debouncer;
        this._textEditorFactory = params.textEditorFactory;
        this._windowComponent = params.windowComponent;
    }

    refresh(editor) {
        if (!editor) return;
        try {
            const textEditor = this._textEditorFactory.create(editor);
            this._refresh(textEditor);
        } catch (e) {
            this._handleError(e);
        }
    }

    _refresh(editor) {
        const decorationOperator = this._decorationOperatorFactory.create([editor]);
        decorationOperator.refreshDecorations();
    }

    refreshWithDelay(_documentChangeEvent) {
        try {
            const editor = this._windowComponent.activeTextEditor;
            this._debouncer.debounce(() => {
                try {
                    if (editor) this._refresh(editor);
                } catch (e) {
                    this._handleError(e);
                }
            });
        } catch (e) {
            this._handleError(e);
        }
    }

    _handleError(e) {
        this._logger.error(e.stack);
    }

}

module.exports = DecorationRefresher;
