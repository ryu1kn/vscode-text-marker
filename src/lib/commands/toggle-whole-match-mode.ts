
export default class ToggleWholeMatchModeCommand {
    private readonly _matchingModeRegistry: any;

    constructor(params) {
        this._matchingModeRegistry = params.matchingModeRegistry;
    }

    execute() {
        this._matchingModeRegistry.toggleWholeMatch();
    }

}
