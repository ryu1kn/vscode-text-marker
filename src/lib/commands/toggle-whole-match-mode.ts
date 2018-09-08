import MatchingModeRegistry from '../matching-mode-registry';
import {CommandLike} from '../vscode/vscode';

export default class ToggleWholeMatchModeCommand implements CommandLike {
    private readonly matchingModeRegistry: MatchingModeRegistry;

    constructor(matchingModeRegistry: MatchingModeRegistry) {
        this.matchingModeRegistry = matchingModeRegistry;
    }

    execute() {
        this.matchingModeRegistry.toggleWholeMatch();
    }

}
