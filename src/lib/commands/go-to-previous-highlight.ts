import TextLocationRegistry from '../text-location-registry';
import TextEditor from '../vscode/text-editor';
import DecorationRegistry from '../decoration/decoration-registry';
import WindowComponent from '../vscode/window';
import MatchingModeRegistry from '../matching-mode-registry';
import {GoToHighlightCommand} from './go-to-highlight';

export class GoToPreviousHighlightCommand extends GoToHighlightCommand {

    constructor(matchingModeRegistry: MatchingModeRegistry,
                textLocationRegistry: TextLocationRegistry,
                decorationRegistry: DecorationRegistry,
                windowComponent: WindowComponent) {
        super(matchingModeRegistry, textLocationRegistry, decorationRegistry, windowComponent);
    }

    protected findTargetLocation(editor: TextEditor) {
        return this.textLocationRegistry.findPreviousOccurence(editor.id, editor.selection);
    }

}
