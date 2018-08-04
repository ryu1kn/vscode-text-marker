import {CommandLike} from '../editor-components/vscode';
import TextLocationRegistry from '../text-location-registry';
import TextEditor from '../text-editor';

export class NextHighlightCommand implements CommandLike {
    private readonly textLocationRegistry: TextLocationRegistry;

    constructor(textLocationRegistry: TextLocationRegistry) {
        this.textLocationRegistry = textLocationRegistry;
    }

    execute(editor: TextEditor) {
        const next = this.textLocationRegistry.findNextOccurence(editor.id, editor.selection);
        next.map(range => { editor.selection = range; });
    }
}
