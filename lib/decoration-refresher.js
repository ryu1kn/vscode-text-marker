
class DecorationRefresher {

    constructor(params) {
        this._vsWindow = params.vsWindow;
        this._logger = params.logger;
        this._decorationOperatorFactory = params.decorationOperatorFactory;
        this._debouncer = params.debouncer;
    }

    refresh(editor) {
        try {
            if (!editor) return;
            const decorationOperator = this._decorationOperatorFactory.create([editor]);
            decorationOperator.refreshDecorations();
        } catch (e) {
            this._handleError(e);
        }
    }

    refreshWithDelay(_documentChangeEvent) {
        try {
            const editor = this._vsWindow.activeTextEditor;
            this._debouncer.debounce(() => this.refresh(editor));
        } catch (e) {
            this._handleError(e);
        }
    }

    _handleError(e) {
        this._logger.error(e.stack);
    }

}

module.exports = DecorationRefresher;
