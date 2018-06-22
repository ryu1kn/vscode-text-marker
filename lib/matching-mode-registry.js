
const Event = require('./const').Event;

class MatchingModeRegistry {

    constructor({eventBus, ignoreCase, wholeMatch}) {
        this._eventBus = eventBus;
        this._ignoreCase = ignoreCase;
        this._wholeMatch = wholeMatch;
        this._broadcastReady();
    }

    _broadcastReady() {
        this._eventBus.once(Event.EXTENSION_READY, () => {
            this._eventBus.emit(Event.MATCHING_MODE_INITIALISED, this.mode);
        });
    }

    toggleCaseSensitivity() {
        this._ignoreCase = !this._ignoreCase;
        this._eventBus.emit(Event.TOGGLED_CASE_SENSITIVITY, {ignoreCase: this._ignoreCase});
    }

    toggleWholeMatch() {
        this._wholeMatch = !this._wholeMatch;
        this._eventBus.emit(Event.WHOLE_MATCH_MODE_TOGGLED, {wholeMatch: this._wholeMatch});
    }

    get mode() {
        return {
            ignoreCase: this._ignoreCase,
            wholeMatch: this._wholeMatch
        };
    }

}

module.exports = MatchingModeRegistry;
