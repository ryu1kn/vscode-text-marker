
'use strict';

class App {
    constructor(params) {
        this._vscode = params.vscode;   // TODO: move this out
        this._logger = params.logger;
        this._decorationRegistry = params.decorationRegistry;
        this._textLocator = params.textLocator;
    }

    markText(editor) {
        try {
            const selectedText = editor.document.getText(editor.selection);  // TODO: consider selectionS
            const decorationType = this._decorationRegistry.inquire(selectedText);
            if (decorationType) {
                this._decorationRegistry.revoke(selectedText);
                this._removeDecoration(decorationType);
            } else {
                const newDecorationType = this._decorationRegistry.issue(selectedText);
                this._addDecoration(newDecorationType, selectedText);
            }
        } catch (e) {
            this._handleError(e);
        }
    }

    _removeDecoration(decorationType) {
        this._vscode.window.visibleTextEditors.forEach(visibleEditor => {
            visibleEditor.setDecorations(decorationType, []);
        });
    }

    _addDecoration(decorationType, selectedText) {
        this._vscode.window.visibleTextEditors.forEach(visibleEditor => {
            const ranges = this._textLocator.locate(visibleEditor, selectedText);
            visibleEditor.setDecorations(decorationType, ranges);
        });
    }

    _handleError(e) {
        this._logger.error(e.stack);
    }
}

module.exports = App;
