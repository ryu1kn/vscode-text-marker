
'use strict';

const _ = require('lodash');

const OVERVIEW_RULER_COLOUR = 'violet';

class DecorationRegistry {

    constructor(params) {
        this._colourRegistry = params.colourRegistry;
        this._window = params.window;
        this._textDecorationMap = {};

        // NOTE: OverviewRulerLane should be set as module variable; but it
        //       doesn't work as the contents of vscode module is different
        //       at real execution and test time..., so I use DI here.
        this._OverviewRulerLane = params.OverviewRulerLane;
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
        return this._window.createTextEditorDecorationType({
            backgroundColor: colour,
            overviewRulerColor: OVERVIEW_RULER_COLOUR,
            overviewRulerLane: this._OverviewRulerLane.Center
        });
    }

}

module.exports = DecorationRegistry;
