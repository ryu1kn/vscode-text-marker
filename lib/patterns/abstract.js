
class AbstractPattern {

    constructor({phrase, ignoreCase = false}) {
        this._phrase = phrase;
        this._ignoreCase = ignoreCase;
    }

    equalTo(other) {
        return this.type === other.type &&
                this._phrase === other._phrase &&
                this._ignoreCase === other._ignoreCase;
    }

}

module.exports = AbstractPattern;
