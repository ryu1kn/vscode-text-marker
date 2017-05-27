
const PatternFactory = require('./pattern-factory');

class TextLocator {

    constructor(params) {
        this._Range = params.Range;
        this._patternFactory = new PatternFactory();
    }

    locate(editor, patternParams) {
        const params = {
            type: patternParams.type,
            pattern: patternParams.value,
            caseSensitive: !patternParams.ignoreCase
        };
        const pattern = this._patternFactory.create(params);
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
