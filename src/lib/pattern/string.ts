import Pattern, {PatternParams} from './pattern';
import {FlatRange} from '../models/flat-range';

export default class StringPattern extends Pattern {

    public type = 'String';

    get displayText() {
        return this.phrase;
    }

    protected findCandidateRanges(text: string): FlatRange[] {
        const memo = {
            ranges: [] as FlatRange[],
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

    private getTextForComparison(text: string) {
        return this.ignoreCase ? text.toLowerCase() : text;
    }

    protected create(params: PatternParams) {
        return new StringPattern(params);
    }

}
