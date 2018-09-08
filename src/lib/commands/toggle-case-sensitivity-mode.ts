import MatchingModeRegistry from '../matching-mode-registry';
import {CommandLike} from '../vscode/vscode';

export default class ToggleCaseSensitivityModeCommand implements CommandLike {
    private readonly matchingModeRegistry: MatchingModeRegistry;

    constructor(matchingModeRegistry: MatchingModeRegistry) {
        this.matchingModeRegistry = matchingModeRegistry;
    }

    execute() {
        this.matchingModeRegistry.toggleCaseSensitivity();
    }

}
