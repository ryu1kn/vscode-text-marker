import AbstractPattern from './abstract';

export default class RegexPattern extends AbstractPattern {

    get type() {
        return 'RegExp';
    }

    get displayText() {
        const caseFlag = this.ignoreCase ? 'i' : '';
        return new RegExp(this.phrase, caseFlag).toString();
    }

    protected _findCandidateRanges(text) {
        const adjustedPattern = this._getAdjustedRegex();
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

    protected _create(params) {
        return new RegexPattern(params);
    }

    private _getAdjustedRegex() {
        const flags = this.ignoreCase ? 'gi' : 'g';
        return new RegExp(this.phrase, flags);
    }

}
