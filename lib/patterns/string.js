
class StringPattern {

    constructor({phrase, ignoreCase = false}) {
        this._phrase = phrase;
        this._ignoreCase = ignoreCase;
    }

    get type() {
        return 'String';
    }

    get patternString() {
        return this._phrase;
    }

    equalTo(other) {
        return this._phrase === other._phrase &&
            this._ignoreCase === other._ignoreCase;
    }

    locateIn(text) {
        const memo = {
            ranges: [],
            lastOffset: 0
        };
        const patternForComparison = this._ignoreCase ? this._phrase.toLowerCase() : this._phrase;
        const entireTextForComparison = this._ignoreCase ? text.toLowerCase() : text;
        const textInFrontOfSelectedText = entireTextForComparison.split(patternForComparison).slice(0, -1);
        const finalMemo = textInFrontOfSelectedText.reduce((memo, textInFront) => {
            const startOffset = memo.lastOffset + textInFront.length;
            const endOffset = startOffset + this._phrase.length;
            return {
                ranges: memo.ranges.concat({startOffset, endOffset}),
                lastOffset: endOffset
            };
        }, memo);
        return finalMemo.ranges;
    }

    toggleCaseSensitivity() {
        this._ignoreCase = !this._ignoreCase;
    }

}

module.exports = StringPattern;
