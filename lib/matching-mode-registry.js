
const Event = require('./const').Event;

class MatchingModeRegistry {

    constructor({eventBus}) {
        this._eventBus = eventBus;
        this._ignoreCase = false;
        this._broadcastReady();
    }

    _broadcastReady() {
        this._eventBus.once(Event.EXTENSION_READY, () => {
            this._eventBus.emit(Event.MATCHING_MODE_INITIALISED, this.mode);
        });
    }

    toggleCaseSensitivity() {
        this._ignoreCase = !this._ignoreCase;
        this._eventBus.emit(Event.TOGGLED_CASE_SENSITIVITY, this.mode);
    }

    get mode() {
        return {ignoreCase: this._ignoreCase};
    }

}

module.exports = MatchingModeRegistry;
