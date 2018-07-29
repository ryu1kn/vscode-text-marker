import MatchingModeRegistry from '../matching-mode-registry';

export default class ToggleCaseSensitivityModeCommand {
    private readonly matchingModeRegistry: MatchingModeRegistry;

    constructor(matchingModeRegistry: MatchingModeRegistry) {
        this.matchingModeRegistry = matchingModeRegistry;
    }

    execute() {
        this.matchingModeRegistry.toggleCaseSensitivity();
    }

}
