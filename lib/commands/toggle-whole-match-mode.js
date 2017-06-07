
class ToggleWholeMatchModeCommand {

    constructor(params) {
        this._matchingModeRegistry = params.matchingModeRegistry;
    }

    execute() {
        this._matchingModeRegistry.toggleWholeMatch();
    }

}

module.exports = ToggleWholeMatchModeCommand;
