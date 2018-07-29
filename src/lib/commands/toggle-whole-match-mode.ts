
export default class ToggleWholeMatchModeCommand {
    private readonly matchingModeRegistry: any;

    constructor(params) {
        this.matchingModeRegistry = params.matchingModeRegistry;
    }

    execute() {
        this.matchingModeRegistry.toggleWholeMatch();
    }

}
