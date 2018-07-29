import MatchingModeRegistry from '../matching-mode-registry';

export default class ToggleWholeMatchModeCommand {
    private readonly matchingModeRegistry: MatchingModeRegistry;

    constructor(matchingModeRegistry: MatchingModeRegistry) {
        this.matchingModeRegistry = matchingModeRegistry;
    }

    execute() {
        this.matchingModeRegistry.toggleWholeMatch();
    }

}
