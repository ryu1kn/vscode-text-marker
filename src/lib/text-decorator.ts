
export default class TextDecorator {
    private readonly _textLocationRegistry: any;

    constructor(params) {
        this._textLocationRegistry = params.textLocationRegistry;
    }

    decorate(editors, decorations) {
        editors.forEach(visibleEditor => {
            decorations.forEach(decoration => {
                if (decoration.decorationType) {
                    this._addDecoration(visibleEditor, decoration);
                }
            });
        });
    }

    undecorate(editors, decorations) {
        decorations.forEach(decoration => {
            editors.forEach(visibleEditor => {
                visibleEditor.unsetDecorations(decoration.decorationType);
            });
            this._textLocationRegistry.deregister(decoration.id);
        });
    }

    private _addDecoration(editor, decoration) {
        const ranges = decoration.pattern.locateIn(editor.wholeText);
        editor.setDecorations(decoration.decorationType, ranges);
        this._textLocationRegistry.register({
            editorId: editor.id,
            decorationId: decoration.id,
            ranges
        });
    }

}
