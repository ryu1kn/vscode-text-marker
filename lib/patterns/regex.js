
class RegexPattern {

    constructor({phrase, ignoreCase = false}) {
        this._raw = phrase;
        this._caseSensitive = !ignoreCase;
    }

    get type() {
        return 'RegExp';
    }

    get patternString() {
        return new RegExp(this._raw).toString();
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
        this._caseSensitive = !this._caseSensitive;
    }

    _getAdjustedRegex() {
        const flags = this._caseSensitive ? 'g' : 'ig';
        return new RegExp(this._raw, flags);
    }

}

module.exports = RegexPattern;
