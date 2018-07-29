import AbstractPattern from './abstract';

export default class RegexPattern extends AbstractPattern {

    public type = 'RegExp';

    get displayText() {
        const caseFlag = this.ignoreCase ? 'i' : '';
        return new RegExp(this.phrase, caseFlag).toString();
    }

    protected findCandidateRanges(text) {
        const adjustedPattern = this.getAdjustedRegex();
        const ranges = [];

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

    protected create(params) {
        return new RegexPattern(params);
    }

    private getAdjustedRegex() {
        const flags = this.ignoreCase ? 'gi' : 'g';
        return new RegExp(this.phrase, flags);
    }

}
