
class TextDecorator {

    constructor(params) {
        this._VsRange = params.VsRange;
    }

    decorate(editors, decorations) {
        editors.forEach(visibleEditor => {
            decorations.forEach(decoration => {
                const decorationType = decoration.decorationType;
                if (decorationType) {
                    this._addDecoration(visibleEditor, decorationType, decoration.pattern);
                }
            });
        });
    }

    undecorate(editors, decorationTypes) {
        editors.forEach(visibleEditor => {
            decorationTypes.forEach(decorationType => {
                visibleEditor.setDecorations(decorationType, []);
            });
        });
    }

    _addDecoration(editor, decorationType, pattern) {
        const ranges = pattern.locateIn(editor.document.getText());
        const vsRanges = ranges.map(range =>
            new this._VsRange(
                editor.document.positionAt(range.start),
                editor.document.positionAt(range.end)
            )
        );
        editor.setDecorations(decorationType, vsRanges);
    }

}

module.exports = TextDecorator;
