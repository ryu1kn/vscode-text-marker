
'use strict';

class App {
    constructor(params) {
        this._vscode = params.vscode;   // TODO: move this out
        this._logger = params.logger;
        this._decorations = {};
    }

    markText(editor) {
        try {
            const selectedText = editor.document.getText(editor.selection);  // TODO: consider selectionS
            const decorationType = this._findTextDecorationType(selectedText);
            this._updateDecorationToVisibleEditors(selectedText, decorationType);
        } catch (e) {
            this._handleError(e);
        }
    }

    _findTextDecorationType(selectedText) {
        return this._decorations[selectedText];
    }

    _updateDecorationToVisibleEditors(selectedText, decorationType) {
        this._vscode.window.visibleTextEditors.forEach(visibleEditor => {
            if (decorationType) {
                this._decorations[selectedText] = null;
                visibleEditor.setDecorations(decorationType, []);
            } else {
                const ranges = this._getSelectedTextRanges(selectedText, visibleEditor);
                const newDecorationType = this._createDecorationType();
                this._decorations[selectedText] = newDecorationType;
                visibleEditor.setDecorations(newDecorationType, ranges);
            }
        });
    }

    _createDecorationType() {
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
