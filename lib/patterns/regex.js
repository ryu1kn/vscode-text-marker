
class RegexPattern {

    constructor({phrase, ignoreCase = false}) {
        this._phrase = phrase;
        this._ignoreCase = ignoreCase;
    }

    get type() {
        return 'RegExp';
    }

    get patternString() {
        return new RegExp(this._phrase).toString();
    }

    locateIn(text) {
        const adjustedPattern = this._getAdjustedRegex();
        const ranges = [];

        text.replace(adjustedPattern, (match, ...args) => {
            const matchLength = match.length;
            if (matchLength > 0) {
                const offset = args[args.length - 2];
                ranges.push({
                    startOffset: offset,
                    endOffset: offset + matchLength
                });
            }
            return match;
        });
        return ranges;
    }

    toggleCaseSensitivity() {
        this._ignoreCase = !this._ignoreCase;
    }

    _getAdjustedRegex() {
        const flags = this._ignoreCase ? 'gi' : 'g';
        return new RegExp(this._phrase, flags);
    }

}

module.exports = RegexPattern;
