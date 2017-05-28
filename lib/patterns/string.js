
const AbstractPattern = require('./abstract');

class StringPattern extends AbstractPattern {

    get type() {
        return 'String';
    }

    get patternString() {
        return this._phrase;
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
        return new StringPattern({
            phrase: this._phrase,
            ignoreCase: !this._ignoreCase
        });
    }

}

module.exports = StringPattern;
