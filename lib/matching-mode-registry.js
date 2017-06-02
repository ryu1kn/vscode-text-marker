
const Const = require('./const');

class MatchingModeRegistry {

    constructor({eventBus}) {
        this._eventBus = eventBus;
        this._ignoreCase = false;
        this._broadcastReady();
    }

    _broadcastReady() {
        this._eventBus.once(Const.Event.EXTENSION_READY, () => {
            this._eventBus.emit(Const.Event.MATCHING_MODE_INITIALISED, this.mode);
        });
    }

    toggleCaseSensitivity() {
        this._ignoreCase = !this._ignoreCase;
        this._eventBus.emit(Const.Event.TOGGLED_CASE_SENSITIVITY, this.mode);
    }

    get mode() {
        return {ignoreCase: this._ignoreCase};
    }

}

module.exports = MatchingModeRegistry;
