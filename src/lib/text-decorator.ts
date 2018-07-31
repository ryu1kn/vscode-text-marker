import TextLocationRegistry from './text-location-registry';

export default class TextDecorator {
    private readonly textLocationRegistry: TextLocationRegistry;

    constructor(textLocationRegistry) {
        this.textLocationRegistry = textLocationRegistry;
    }

    decorate(editors, decorations) {
        editors.forEach(visibleEditor => {
            decorations.forEach(decoration => {
                if (decoration.decorationType) {
                    this.addDecoration(visibleEditor, decoration);
                }
            });
        });
    }

    undecorate(editors, decorations) {
        decorations.forEach(decoration => {
            editors.forEach(visibleEditor => {
                visibleEditor.unsetDecorations(decoration.decorationType);
            });
            this.textLocationRegistry.deregister(decoration.id);
        });
    }

    private addDecoration(editor, decoration) {
        const ranges = decoration.pattern.locateIn(editor.wholeText);
        editor.setDecorations(decoration.decorationType, ranges);
        this.textLocationRegistry.register({
            editorId: editor.id,
            decorationId: decoration.id,
            ranges
        });
    }

}
