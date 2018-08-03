import MatchingModeRegistry from '../matching-mode-registry';
import {CommandLike} from '../editor-components/vscode';

export default class ToggleCaseSensitivityModeCommand implements CommandLike {
    private readonly matchingModeRegistry: MatchingModeRegistry;

    constructor(matchingModeRegistry: MatchingModeRegistry) {
        this.matchingModeRegistry = matchingModeRegistry;
    }

    execute() {
        this.matchingModeRegistry.toggleCaseSensitivity();
    }

}
