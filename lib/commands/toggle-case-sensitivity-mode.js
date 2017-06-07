
class ToggleCaseSensitivityModeCommand {

    constructor(params) {
        this._matchingModeRegistry = params.matchingModeRegistry;
    }

    execute() {
        this._matchingModeRegistry.toggleCaseSensitivity();
    }

}

module.exports = ToggleCaseSensitivityModeCommand;
