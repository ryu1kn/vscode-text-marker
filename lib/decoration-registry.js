
'use strict';

class DecorationRegistry {
    constructor(params) {
        this._window = params.window;
        this._textDecorationMap = {};
    }

    inquire(string) {
        const decorationType = this._textDecorationMap[string];
        return decorationType || null;
    }

    issue(string) {
        const decorationType = this._generateDecorationType();
        this._textDecorationMap[string] = decorationType;
        return decorationType;
    }

    revoke(string) {
        this._textDecorationMap[string] = null;
    }

    retrieveAll() {
        return Object.assign({}, this._textDecorationMap);
    }

    _generateDecorationType() {
        return this._window.createTextEditorDecorationType({color: 'pink'});
    }
}

module.exports = DecorationRegistry;
