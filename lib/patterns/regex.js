
const AbstractPattern = require('./abstract');

class RegexPattern extends AbstractPattern {

    get type() {
        return 'RegExp';
    }

    get phrase() {
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
        return new RegexPattern({
            phrase: this._phrase,
            ignoreCase: !this.ignoreCase
        });
    }

    _getAdjustedRegex() {
        const flags = this.ignoreCase ? 'gi' : 'g';
        return new RegExp(this._phrase, flags);
    }

}

module.exports = RegexPattern;
