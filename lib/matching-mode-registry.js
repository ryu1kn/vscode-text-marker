
class MatchingModeRegistry {

    constructor({eventBus}) {
        this._eventBus = eventBus;
        this._ignoreCase = false;
        this._broadcastReady();
    }

    _broadcastReady() {
        this._eventBus.once('TEXT_MARKER_READY', () => {
            this._eventBus.emit('MATCHING_MODE_INITIALISED', this.mode);
        });
    }

    toggleCaseSensitivity() {
        this._ignoreCase = !this._ignoreCase;
        this._eventBus.emit('TOGGLED_CASE_SENSITIVITY', this.mode);
    }

    get mode() {
        return {ignoreCase: this._ignoreCase};
    }

}

module.exports = MatchingModeRegistry;
