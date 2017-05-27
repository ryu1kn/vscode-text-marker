
class RegexPattern {

    constructor({pattern, caseSensitive = true}) {
        this._raw = pattern;
        this._caseSensitive = caseSensitive;
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

    _getAdjustedRegex() {
        const flags = this._caseSensitive ? 'g' : 'ig';
        return new RegExp(this._raw, flags);
    }

}

module.exports = RegexPattern;
