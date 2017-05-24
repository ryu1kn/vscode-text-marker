
const _ = require('lodash');

class DecorationOperator {

    constructor(params) {
        this._editors = params.editors;
        this._decorationRegistry = params.decorationRegistry;
        this._textDecorator = params.textDecorator;
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

        const decorationSpec = {
            pattern,
            decorationType: decoration.decorationType
        };
        this._textDecorator.decorate(this._editors, [decorationSpec]);
    }

    removeDecoration(decorationId) {
        const decoration = this._decorationRegistry.inquireById(decorationId);
        this._removeDecoration(decoration);
    }

    _removeDecoration(decoration) {
        this._decorationRegistry.revoke(decoration.id);
        this._textDecorator.undecorate(this._editors, [decoration.decorationType]);
    }

    removeAllDecorations() {
        const decorations = this._decorationRegistry.retrieveAll();
        decorations.forEach(decoration => {
            this._decorationRegistry.revoke(decoration.id);
        });
        this._textDecorator.undecorate(this._editors, _.map(decorations, 'decorationType'));
    }

    refreshDecorations() {
        const decorations = this._decorationRegistry.retrieveAll();
        this._textDecorator.decorate(this._editors, decorations);
    }

}

module.exports = DecorationOperator;
