
export default class ToggleCaseSensitivityModeCommand {
    private readonly _matchingModeRegistry: any;

    constructor(params) {
        this._matchingModeRegistry = params.matchingModeRegistry;
    }

    execute() {
        this._matchingModeRegistry.toggleCaseSensitivity();
    }

}
