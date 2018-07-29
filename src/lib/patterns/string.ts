import AbstractPattern from './abstract';

export default class StringPattern extends AbstractPattern {

    get type() {
        return 'String';
    }

    get displayText() {
        return this.phrase;
    }

    _findCandidateRanges(text) {
        const memo = {
            ranges: [],
            lastOffset: 0
        };
        const textInFrontOfSelectedText = this._getTextForComparison(text)
            .split(this._getPhraseForComparison())
            .slice(0, -1);
        const finalMemo = textInFrontOfSelectedText.reduce((memo, textInFront) => {
            const start = memo.lastOffset + textInFront.length;
            const end = start + this.phrase.length;
            return {
                ranges: memo.ranges.concat({start, end}),
                lastOffset: end
            };
        }, memo);
        return finalMemo.ranges;
    }

    _getPhraseForComparison() {
        return this.ignoreCase ? this.phrase.toLowerCase() : this.phrase;
    }

    _getTextForComparison(text) {
        return this.ignoreCase ? text.toLowerCase() : text;
    }

    _create(params) {
        return new StringPattern(params);
    }

}
