import {FlatRange} from '../vscode/flat-range';

export type PatternParams = {
    phrase: string;
    ignoreCase?: boolean;
    wholeMatch?: boolean;
};

export default abstract class Pattern {
    public readonly phrase: string;
    public readonly ignoreCase: boolean;
    public readonly wholeMatch: boolean;

    public abstract type: string;
    public abstract displayText: string;
    protected abstract create(params: PatternParams): Pattern;
    protected abstract findCandidateRanges(text: string): FlatRange[];

    constructor(params: PatternParams) {
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

    updatePhrase(newPhrase: string) {
        return this.create({
            phrase: newPhrase,
            ignoreCase: this.ignoreCase,
            wholeMatch: this.wholeMatch
        });
    }

    equalTo(other: Pattern) {
        return this.type === other.type &&
                this.phrase === other.phrase &&
                this.ignoreCase === other.ignoreCase &&
                this.wholeMatch === other.wholeMatch;
    }

    locateIn(text: string): FlatRange[] {
        const candidateRanges = this.findCandidateRanges(text);
        return this.wholeMatch ? this.filterwholeMatchMatch(text, candidateRanges) : candidateRanges;
    }

    private filterwholeMatchMatch(text: string, ranges: FlatRange[]) {
        return ranges.filter(range =>
            !/\w\w/.test(text.substring(range.start - 1, range.start + 1)) &&
            !/\w\w/.test(text.substring(range.end - 1, range.end + 1))
        );
    }

}
