
class AbstractPattern {

    constructor(params) {
        this._phrase = params.phrase;
        this._ignoreCase = params.ignoreCase || false;
        this._wholeMatch = params.wholeMatch || false;
    }

    get ignoreCase() {
        return this._ignoreCase;
    }

    get wholeMatch() {
        return this._wholeMatch;
    }

    toggleCaseSensitivity() {
        return this._create({
            phrase: this._phrase,
            ignoreCase: !this.ignoreCase,
            wholeMatch: this.wholeMatch
        });
    }

    toggleWholeMatch() {
        return this._create({
            phrase: this._phrase,
            ignoreCase: this.ignoreCase,
            wholeMatch: !this.wholeMatch
        });
    }

    updatePhrase(newPhrase) {
        return this._create({
            phrase: newPhrase,
            ignoreCase: this.ignoreCase,
            wholeMatch: this.wholeMatch
        });
    }

    equalTo(other) {
        return this.type === other.type &&
                this._phrase === other._phrase &&
                this.ignoreCase === other.ignoreCase &&
                this.wholeMatch === other.wholeMatch;
    }

    locateIn(text) {
        const candidateRanges = this._findCandidateRanges(text);
        return this.wholeMatch ? this._filterwholeMatchMatch(text, candidateRanges) : candidateRanges;
    }

    _filterwholeMatchMatch(text, ranges) {
        return ranges.filter(range =>
            !/\w\w/.test(text.substring(range.start - 1, range.start + 1)) &&
            !/\w\w/.test(text.substring(range.end - 1, range.end + 1))
        );
    }

}

module.exports = AbstractPattern;
