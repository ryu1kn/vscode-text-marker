import AbstractPattern from './abstract';

export default class StringPattern extends AbstractPattern {

    public type = 'String';

    get displayText() {
        return this.phrase;
    }

    protected findCandidateRanges(text) {
        const memo = {
            ranges: [],
            lastOffset: 0
        };
        const textInFrontOfSelectedText = this.getTextForComparison(text)
            .split(this.getPhraseForComparison())
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

    private getPhraseForComparison() {
        return this.ignoreCase ? this.phrase.toLowerCase() : this.phrase;
    }

    private getTextForComparison(text) {
        return this.ignoreCase ? text.toLowerCase() : text;
    }

    protected create(params) {
        return new StringPattern(params);
    }

}
