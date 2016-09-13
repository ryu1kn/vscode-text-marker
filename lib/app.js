
'use strict';

class App {

    constructor(params) {
        this._vscode = params.vscode;   // TODO: move this out
        this._logger = params.logger;
        this._decorationOperatorFactory = params.decorationOperatorFactory;
        this._debouncer = params.debouncer;
    }

    markText(editor) {
        try {
            const selectedText = editor.document.getText(editor.selection); // TODO: consider selectionS
            if (!selectedText) return;

            const visibleEditors = this._vscode.window.visibleTextEditors;
            const decorationOperator = this._decorationOperatorFactory.create(visibleEditors);
            decorationOperator.toggleDecoration(selectedText);
        } catch (e) {
            this._handleError(e);
        }
    }

    clearAllHighlight() {
        try {
            const visibleEditors = this._vscode.window.visibleTextEditors;
            const decorationOperator = this._decorationOperatorFactory.create(visibleEditors);
            decorationOperator.removeAllDecorations();
        } catch (e) {
            this._handleError(e);
        }
    }

    refreshDecorations(editor) {
        try {
            if (!editor) return;
            const decorationOperator = this._decorationOperatorFactory.create([editor]);
            decorationOperator.refreshDecorations();
        } catch (e) {
            this._handleError(e);
        }
    }

    refreshDecorationsWithDelay(_documentChangeEvent) {
        try {
            const editor = this._vscode.window.activeTextEditor;
            this._debouncer.debounce(() => this.refreshDecorations(editor));
        } catch (e) {
            this._handleError(e);
        }
    }

    _handleError(e) {
        this._logger.error(e.stack);
    }

}

module.exports = App;
