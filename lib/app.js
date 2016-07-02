
'use strict';

class App {
    constructor(params) {
        this._vscode = params.vscode;   // TODO: move this out
        this._logger = params.logger;
        this._decorationRegistry = params.decorationRegistry;
        this._textDecorator = params.textDecorator;
        this._throttle = params.throttle;
    }

    markText(editor) {
        try {
            const selectedText = editor.document.getText(editor.selection); // TODO: consider selectionS
            if (!selectedText) return;

            const decorationType = this._decorationRegistry.inquire(selectedText);
            const visibleEditors = this._vscode.window.visibleTextEditors;
            if (decorationType) {
                this._decorationRegistry.revoke(selectedText);
                this._textDecorator.undecorate(visibleEditors, decorationType);
            } else {
                const newDecorationType = this._decorationRegistry.issue(selectedText);
                this._textDecorator.decorate(visibleEditors, newDecorationType, selectedText);
            }
        } catch (e) {
            this._handleError(e);
        }
    }

    refreshDecorations(editor) {
        try {
            if (!editor) return;

            const decorationTypeMap = this._decorationRegistry.retrieveAll();
            Object.keys(decorationTypeMap).forEach(text => {
                this._textDecorator.decorate([editor], decorationTypeMap[text], text);
            });
        } catch (e) {
            this._handleError(e);
        }
    }

    refreshDecorationsWithDelay(_documentChangeEvent) {
        try {
            const editor = this._vscode.window.activeTextEditor;
            this._throttle.throttle(() => this.refreshDecorations(editor));
        } catch (e) {
            this._handleError(e);
        }
    }

    _handleError(e) {
        this._logger.error(e.stack);
    }
}

module.exports = App;
