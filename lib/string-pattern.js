
class StringPattern {

    constructor({phrase, caseSensitive = true}) {
        this._raw = phrase;
        this._caseSensitive = caseSensitive;
    }

    get type() {
        return 'String';
    }

    get patternString() {
        return this._raw;
    }

    locateIn(text) {
        const memo = {
            ranges: [],
            lastOffset: 0
        };
        const ignoreCase = !this._caseSensitive;
        const value = this._raw;
        const patternForComparison = ignoreCase ? value.toLowerCase() : value;
        const entireTextForComparison = ignoreCase ? text.toLowerCase() : text;
        const textInFrontOfSelectedText = entireTextForComparison.split(patternForComparison).slice(0, -1);
        const finalMemo = textInFrontOfSelectedText.reduce((memo, textInFront) => {
            const startOffset = memo.lastOffset + textInFront.length;
            const endOffset = startOffset + value.length;
            return {
                ranges: memo.ranges.concat({startOffset, endOffset}),
                lastOffset: endOffset
            };
        }, memo);
        return finalMemo.ranges;
    }

    toggleCaseSensitivity() {
        this._caseSensitive = !this._caseSensitive;
    }

}

module.exports = StringPattern;
