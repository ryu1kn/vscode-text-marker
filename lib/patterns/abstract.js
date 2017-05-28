
class AbstractPattern {

    constructor({phrase, ignoreCase = false}) {
        this._phrase = phrase;
        this._ignoreCase = ignoreCase;
    }

    get ignoreCase() {
        return this._ignoreCase;
    }

    equalTo(other) {
        return this.type === other.type &&
                this._phrase === other._phrase &&
                this.ignoreCase === other.ignoreCase;
    }

}

module.exports = AbstractPattern;
