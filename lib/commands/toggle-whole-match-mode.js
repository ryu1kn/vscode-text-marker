
class ToggleWholeMatchModeCommand {

    constructor(params) {
        this._logger = params.logger;
        this._matchingModeRegistry = params.matchingModeRegistry;
    }

    execute() {
        try {
            this._matchingModeRegistry.toggleWholeMatch();
        } catch (e) {
            this._handleError(e);
        }
    }

    _handleError(e) {
        this._logger.error(e.stack);
    }

}

module.exports = ToggleWholeMatchModeCommand;
