
export default class ToggleCaseSensitivityModeCommand {
    private readonly matchingModeRegistry: any;

    constructor(params) {
        this.matchingModeRegistry = params.matchingModeRegistry;
    }

    execute() {
        this.matchingModeRegistry.toggleCaseSensitivity();
    }

}
