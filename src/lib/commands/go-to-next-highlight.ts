import TextLocationRegistry from '../text-location-registry';
import TextEditor from '../vscode/text-editor';
import DecorationRegistry from '../decoration/decoration-registry';
import WindowComponent from '../vscode/window';
import MatchingModeRegistry from '../matching-mode-registry';
import {GoToHighlightCommand} from './go-to-highlight';
import {DecorationTypeRegistry} from '../decoration/decoration-type-registry';

export class GoToNextHighlightCommand extends GoToHighlightCommand {

    constructor(matchingModeRegistry: MatchingModeRegistry,
                textLocationRegistry: TextLocationRegistry,
                decorationRegistry: DecorationRegistry,
                decorationTypeRegistry: DecorationTypeRegistry,
                windowComponent: WindowComponent) {
        super(matchingModeRegistry, textLocationRegistry, decorationRegistry, decorationTypeRegistry, windowComponent);
    }

    protected findTargetLocation(editor: TextEditor) {
        return this.textLocationRegistry.findNextOccurence(editor.id, editor.selection);
    }

}
