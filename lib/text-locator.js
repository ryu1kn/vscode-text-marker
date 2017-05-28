
class TextLocator {

    constructor(params) {
        this._Range = params.Range;
    }

    locate(editor, pattern) {
        const ranges = pattern.locateIn(editor.document.getText());
        return ranges.map(range => this._getRangeFromOffset(range.start, range.end, editor));
    }

    _getRangeFromOffset(start, end, editor) {
        return new this._Range(
            editor.document.positionAt(start),
            editor.document.positionAt(end)
        );
    }

}

module.exports = TextLocator;
