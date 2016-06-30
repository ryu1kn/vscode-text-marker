
'use strict';

class App {
    constructor(params) {
        this._vscode = params.vscode;   // TODO: move this out
        this._logger = params.logger;
    }

    markText(editor) {
        try {
            const selectedText = editor.document.getText(editor.selection);  // TODO: consider selectionS
            this._setDecorationToVisibleEditors(selectedText);
        } catch (e) {
            this._handleError(e);
        }
    }

    _setDecorationToVisibleEditors(selectedText) {
        this._vscode.window.visibleTextEditors.forEach(visibleEditor => {
            const ranges = this._getSelectedTextRanges(selectedText, visibleEditor);
            visibleEditor.setDecorations(this._getDecorationType(), ranges);
        });
    }

    _getDecorationType() {
        return this._vscode.window.createTextEditorDecorationType({color: 'pink'});
    }

    _getSelectedTextRanges(selectedText, editor) {
        const entireText = editor.document.getText();
        const memo = {
            ranges: [],
            lastOffset: 0
        };
        const textInFrontOfSelectedText = entireText.split(selectedText).slice(0, -1);
        const finalMemo = textInFrontOfSelectedText.reduce((memo, textInFront) => {
            const startOffset = memo.lastOffset + textInFront.length;
            const endOffset = startOffset + selectedText.length;
            return {
                ranges: memo.ranges.concat(this._getRangeFromOffset(startOffset, endOffset, editor)),
                lastOffset: endOffset
            };
        }, memo);
        return finalMemo.ranges;
    }

    _getRangeFromOffset(startOffset, endOffset, editor) {
        return new this._vscode.Range(
            editor.document.positionAt(startOffset),
            editor.document.positionAt(endOffset)
        );
    }

    _handleError(e) {
        this._logger.error(e.stack);
    }
}

module.exports = App;
