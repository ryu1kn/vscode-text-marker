import TextLocationRegistry from '../text-location-registry';
import TextEditor from '../text-editor';
import DecorationRegistry from '../decoration-registry';
import WindowComponent from '../editor-components/window';
import MatchingModeRegistry from '../matching-mode-registry';
import {GoToHighlightCommand} from './go-to-highlight';

export class GoToNextHighlightCommand extends GoToHighlightCommand {

    constructor(matchingModeRegistry: MatchingModeRegistry,
                textLocationRegistry: TextLocationRegistry,
                decorationRegistry: DecorationRegistry,
                windowComponent: WindowComponent) {
        super(matchingModeRegistry, textLocationRegistry, decorationRegistry, windowComponent);
    }

    protected findTargetLocation(editor: TextEditor) {
        return this.textLocationRegistry.findNextOccurence(editor.id, editor.selection);
    }

}
