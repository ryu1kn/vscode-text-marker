
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
            this._updateDecorationToVisibleEditors(selectedText, decorationType);
        } catch (e) {
            this._handleError(e);
        }
    }

    _updateDecorationToVisibleEditors(selectedText, decorationType) {
        this._vscode.window.visibleTextEditors.forEach(visibleEditor => {
            if (decorationType) {
                visibleEditor.setDecorations(decorationType, []);
            } else {
                const ranges = this._textLocator.locate(visibleEditor, selectedText);
                const newDecorationType = this._decorationRegistry.issue(selectedText);
                visibleEditor.setDecorations(newDecorationType, ranges);
            }
        });
    }

    _handleError(e) {
        this._logger.error(e.stack);
    }
}

module.exports = App;
