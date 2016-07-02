
'use strict';

class TextDecorator {
    constructor(params) {
        this._textLocator = params.textLocator;
    }

    decorate(editors, textDecorationMap) {
        editors.forEach(visibleEditor => {
            Object.keys(textDecorationMap).forEach(text => {
                this._addDecoration(visibleEditor, textDecorationMap[text], text);
            });
        });
    }

    undecorate(editors, decorationType) {
        editors.forEach(visibleEditor => {
            visibleEditor.setDecorations(decorationType, []);
        });
    }

    _addDecoration(editor, decorationType, selectedText) {
        const ranges = this._textLocator.locate(editor, selectedText);
        editor.setDecorations(decorationType, ranges);
    }
}

module.exports = TextDecorator;
