
class DecorationOperator {

    constructor(params) {
        this._editors = params.editors;
        this._decorationRegistry = params.decorationRegistry;
        this._textDecorator = params.textDecorator;
        this._patternConverter = params.patternConverter;
    }

    toggleDecoration(pattern) {
        const decoration = this._decorationRegistry.inquireByPattern(pattern);
        if (decoration) {
            this._removeDecoration(decoration);
        } else {
            this.addDecoration(pattern);
        }
    }

    addDecoration(pattern) {
        const decoration = this._decorationRegistry.issue(pattern);
        if (!decoration) return;

        this._textDecorator.decorate(this._editors, [decoration]);
    }

    removeDecoration(decorationId) {
        const decoration = this._decorationRegistry.inquireById(decorationId);
        this._removeDecoration(decoration);
    }

    _removeDecoration(decoration) {
        this._decorationRegistry.revoke(decoration.id);
        this._textDecorator.undecorate(this._editors, [decoration]);
    }

    updateDecorationWithPatternAction(decorationId, convertAction) {
        const decoration = this._decorationRegistry.inquireById(decorationId);
        const newPattern = this._patternConverter.convert(decoration.pattern, convertAction);
        this._updateDecorationWithPattern(decoration, newPattern);
    }

    updateDecorationPattern(decorationId, newPattern) {
        const decoration = this._decorationRegistry.inquireById(decorationId);
        this._updateDecorationWithPattern(decoration, newPattern);
    }

    _updateDecorationWithPattern(decoration, newPattern) {
        this._textDecorator.undecorate(this._editors, [decoration]);

        const newDecoration = this._decorationRegistry.updatePattern(decoration.id, newPattern);
        this._textDecorator.decorate(this._editors, [newDecoration]);
    }

    removeAllDecorations() {
        const decorations = this._decorationRegistry.retrieveAll();
        decorations.forEach(decoration => {
            this._decorationRegistry.revoke(decoration.id);
        });
        this._textDecorator.undecorate(this._editors, decorations);
    }

    refreshDecorations() {
        const decorations = this._decorationRegistry.retrieveAll();
        this._textDecorator.decorate(this._editors, decorations);
    }

}

module.exports = DecorationOperator;
