
class TextDecorator {

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
        const ranges = pattern.locateIn(editor.wholeText);
        editor.setDecorations(decorationType, ranges);
    }

}

module.exports = TextDecorator;
