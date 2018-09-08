import TextLocationRegistry from '../text-location-registry';
import TextEditor from '../vscode/text-editor';
import {Decoration} from '../entities/decoration';

export default class TextDecorator {
    private readonly textLocationRegistry: TextLocationRegistry;

    constructor(textLocationRegistry: TextLocationRegistry) {
        this.textLocationRegistry = textLocationRegistry;
    }

    decorate(editors: TextEditor[], decorations: Decoration[]) {
        editors.forEach(visibleEditor => {
            decorations.forEach(decoration => {
                if (decoration.decorationType) {
                    this.addDecoration(visibleEditor, decoration);
                }
            });
        });
    }

    undecorate(editors: TextEditor[], decorations: Decoration[]) {
        decorations.forEach(decoration => {
            editors.forEach(visibleEditor => {
                visibleEditor.unsetDecorations(decoration.decorationType);
            });
            this.textLocationRegistry.deregister(decoration.id);
        });
    }

    private addDecoration(editor: TextEditor, decoration: Decoration) {
        const ranges = decoration.pattern.locateIn(editor.wholeText);
        editor.setDecorations(decoration.decorationType, ranges);
        this.textLocationRegistry.register(editor.id, decoration.id, ranges);
    }

}
