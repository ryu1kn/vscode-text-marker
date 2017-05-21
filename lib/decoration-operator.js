
const _ = require('lodash');

class DecorationOperator {

    constructor(params) {
        this._editors = params.editors;
        this._decorationRegistry = params.decorationRegistry;
        this._textDecorator = params.textDecorator;
    }

    toggleDecoration(pattern) {
        const decorationType = this._decorationRegistry.inquire(pattern);
        if (decorationType) {
            this._removeDecoration(pattern, decorationType);
        } else {
            this._addDecoration(pattern);
        }
    }

    _addDecoration(pattern) {
        const decoration = {
            pattern,
            decorationType: this._decorationRegistry.issue(pattern)
        };
        this._textDecorator.decorate(this._editors, [decoration]);
    }

    _removeDecoration(pattern, decorationType) {
        this._decorationRegistry.revoke(pattern);
        this._textDecorator.undecorate(this._editors, [decorationType]);
    }

    removeAllDecorations() {
        const decorations = this._decorationRegistry.retrieveAll();
        decorations.forEach(decoration => {
            this._decorationRegistry.revoke(decoration.pattern);
        });
        this._textDecorator.undecorate(this._editors, _.map(decorations, 'decorationType'));
    }

    refreshDecorations() {
        const decorations = this._decorationRegistry.retrieveAll();
        this._textDecorator.decorate(this._editors, decorations);
    }

}

module.exports = DecorationOperator;
