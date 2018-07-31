import {FlatRange} from '../models/flat-range';

export default abstract class Pattern {
    public readonly phrase: string;
    public readonly ignoreCase: boolean;
    public readonly wholeMatch: boolean;

    public abstract type;
    protected abstract create(params): Pattern;
    protected abstract findCandidateRanges(text): FlatRange[];

    constructor(params) {
        this.phrase = params.phrase;
        this.ignoreCase = params.ignoreCase || false;
        this.wholeMatch = params.wholeMatch || false;
    }

    toggleCaseSensitivity() {
        return this.create({
            phrase: this.phrase,
            ignoreCase: !this.ignoreCase,
            wholeMatch: this.wholeMatch
        });
    }

    toggleWholeMatch() {
        return this.create({
            phrase: this.phrase,
            ignoreCase: this.ignoreCase,
            wholeMatch: !this.wholeMatch
        });
    }

    updatePhrase(newPhrase) {
        return this.create({
            phrase: newPhrase,
            ignoreCase: this.ignoreCase,
            wholeMatch: this.wholeMatch
        });
    }

    equalTo(other) {
        return this.type === other.type &&
                this.phrase === other.phrase &&
                this.ignoreCase === other.ignoreCase &&
                this.wholeMatch === other.wholeMatch;
    }

    locateIn(text): FlatRange {
        const candidateRanges = this.findCandidateRanges(text);
        return this.wholeMatch ? this.filterwholeMatchMatch(text, candidateRanges) : candidateRanges;
    }

    private filterwholeMatchMatch(text, ranges) {
        return ranges.filter(range =>
            !/\w\w/.test(text.substring(range.start - 1, range.start + 1)) &&
            !/\w\w/.test(text.substring(range.end - 1, range.end + 1))
        );
    }

}
