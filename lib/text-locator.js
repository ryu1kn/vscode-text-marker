
class TextLocator {

    constructor(params) {
        this._Range = params.Range;
    }

    locate(editor, string) {
        const entireText = editor.document.getText();
        const memo = {
            ranges: [],
            lastOffset: 0
        };
        const textInFrontOfSelectedText = entireText.split(string).slice(0, -1);
        const finalMemo = textInFrontOfSelectedText.reduce((memo, textInFront) => {
            const startOffset = memo.lastOffset + textInFront.length;
            const endOffset = startOffset + string.length;
            return {
                ranges: memo.ranges.concat(this._getRangeFromOffset(startOffset, endOffset, editor)),
                lastOffset: endOffset
            };
        }, memo);
        return finalMemo.ranges;
    }

    _getRangeFromOffset(startOffset, endOffset, editor) {
        return new this._Range(
            editor.document.positionAt(startOffset),
            editor.document.positionAt(endOffset)
        );
    }

}

module.exports = TextLocator;
