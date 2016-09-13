
'use strict';

class DecorationOperator {

    constructor(params) {
        this._editors = params.editors;
        this._decorationRegistry = params.decorationRegistry;
        this._textDecorator = params.textDecorator;
    }

    toggleDecoration(text) {
        const decorationType = this._decorationRegistry.inquire(text);
        if (decorationType) {
            this.removeDecoration(text, decorationType);
        } else {
            this._addDecoration(text);
        }
    }

    _addDecoration(text) {
        const newDecorationType = this._decorationRegistry.issue(text);
        this._textDecorator.decorate(this._editors, {[text]: newDecorationType});
    }

    removeDecoration(text, decorationType) {
        this._decorationRegistry.revoke(text);
        this._textDecorator.undecorate(this._editors, [decorationType]);
    }

    refreshDecoration() {
        const decorationTypeMap = this._decorationRegistry.retrieveAll();
        this._textDecorator.decorate(this._editors, decorationTypeMap);
    }

}

module.exports = DecorationOperator;
