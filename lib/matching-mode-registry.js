
class MatchingModeRegistry {

    constructor() {
        this._ignoreCase = false;
    }

    toggleCaseSensitivity() {
        this._ignoreCase = !this._ignoreCase;
    }

    get mode() {
        return {ignoreCase: this._ignoreCase};
    }

}

module.exports = MatchingModeRegistry;
