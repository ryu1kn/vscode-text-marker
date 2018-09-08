import Pattern, {PatternParams} from './pattern';
import {FlatRange} from '../vscode/flat-range';

export default class RegexPattern extends Pattern {

    public type = 'RegExp';

    get displayText() {
        const caseFlag = this.ignoreCase ? 'i' : '';
        return new RegExp(this.phrase, caseFlag).toString();
    }

    protected findCandidateRanges(text: string): FlatRange[] {
        const adjustedPattern = this.getAdjustedRegex();
        const ranges: FlatRange[] = [];

        text.replace(adjustedPattern, (match, ...args) => {
            const matchLength = match.length;
            if (matchLength > 0) {
                const offset = args[args.length - 2];
                ranges.push({
                    start: offset,
                    end: offset + matchLength
                });
            }
            return match;
        });
        return ranges;
    }

    protected create(params: PatternParams) {
        return new RegexPattern(params);
    }

    private getAdjustedRegex() {
        const flags = this.ignoreCase ? 'gi' : 'g';
        return new RegExp(this.phrase, flags);
    }

}
