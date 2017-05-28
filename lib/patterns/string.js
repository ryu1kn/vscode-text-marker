
const AbstractPattern = require('./abstract');

class StringPattern extends AbstractPattern {

    get type() {
        return 'String';
    }

    get phrase() {
        return this._phrase;
    }

    locateIn(text) {
        const memo = {
            ranges: [],
            lastOffset: 0
        };
        const patternForComparison = this.ignoreCase ? this._phrase.toLowerCase() : this._phrase;
        const entireTextForComparison = this.ignoreCase ? text.toLowerCase() : text;
        const textInFrontOfSelectedText = entireTextForComparison.split(patternForComparison).slice(0, -1);
        const finalMemo = textInFrontOfSelectedText.reduce((memo, textInFront) => {
            const start = memo.lastOffset + textInFront.length;
            const end = start + this._phrase.length;
            return {
                ranges: memo.ranges.concat({start, end}),
                lastOffset: end
            };
        }, memo);
        return finalMemo.ranges;
    }

    toggleCaseSensitivity() {
        return new StringPattern({
            phrase: this._phrase,
            ignoreCase: !this.ignoreCase
        });
    }

}

module.exports = StringPattern;
