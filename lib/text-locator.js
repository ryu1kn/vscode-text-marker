
class TextLocator {

    constructor(params) {
        this._Range = params.Range;
    }

    locate(editor, pattern) {
        const ranges = pattern.locateIn(editor.document.getText());
        return ranges.map(range => this._getRangeFromOffset(range.startOffset, range.endOffset, editor));
    }

    _getRangeFromOffset(startOffset, endOffset, editor) {
        return new this._Range(
            editor.document.positionAt(startOffset),
            editor.document.positionAt(endOffset)
        );
    }

}

module.exports = TextLocator;
