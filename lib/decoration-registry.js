
'use strict';

const _ = require('lodash');

class DecorationRegistry {
    constructor(params) {
        this._colourRegistry = params.colourRegistry;
        this._window = params.window;
        this._textDecorationMap = {};
    }

    inquire(string) {
        const decoration = this._textDecorationMap[string];
        return _.get(decoration, 'decorationType', null);
    }

    issue(string) {
        const colour = this._colourRegistry.issue();
        const decorationType = this._generateDecorationType(colour);
        this._textDecorationMap[string] = {colour, decorationType};
        return decorationType;
    }

    revoke(string) {
        const decoration = this._textDecorationMap[string];
        this._colourRegistry.revoke(decoration.colour);
        this._textDecorationMap[string] = null;
    }

    retrieveAll() {
        return _.mapValues(
            _.pickBy(this._textDecorationMap),
            decoration => decoration.decorationType
        );
    }

    _generateDecorationType(colour) {
        return this._window.createTextEditorDecorationType({backgroundColor: colour});
    }
}

module.exports = DecorationRegistry;
