
'use strict';

class App {
    constructor(params) {
        this._vscode = params.vscode;   // TODO: move this out
        this._logger = params.logger;
        this._decorationRegistry = params.decorationRegistry;
        this._textLocator = params.textLocator;
        this._throttle = params.throttle;
    }

    markText(editor) {
        try {
            const selectedText = editor.document.getText(editor.selection);  // TODO: consider selectionS
            const decorationType = this._decorationRegistry.inquire(selectedText);
            if (decorationType) {
                this._decorationRegistry.revoke(selectedText);
                this._removeDecorationFromVisibleEditors(decorationType);
            } else {
                const newDecorationType = this._decorationRegistry.issue(selectedText);
                this._addDecorationToVisibleEditors(newDecorationType, selectedText);
            }
        } catch (e) {
            this._handleError(e);
        }
    }

    _removeDecorationFromVisibleEditors(decorationType) {
        this._vscode.window.visibleTextEditors.forEach(visibleEditor => {
            visibleEditor.setDecorations(decorationType, []);
        });
    }

    _addDecorationToVisibleEditors(decorationType, selectedText) {
        this._vscode.window.visibleTextEditors.forEach(
            visibleEditor => this._addDecoration(visibleEditor, decorationType, selectedText)
        );
    }

    _addDecoration(editor, decorationType, selectedText) {
        const ranges = this._textLocator.locate(editor, selectedText);
        editor.setDecorations(decorationType, ranges);
    }

    refreshDecorations(editor) {
        try {
            if (!editor) return;

            const decorationTypeMap = this._decorationRegistry.retrieveAll();
            Object.keys(decorationTypeMap).forEach(text => {
                this._addDecoration(editor, decorationTypeMap[text], text);
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
