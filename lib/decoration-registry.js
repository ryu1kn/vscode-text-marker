
const _ = require('lodash');
const OverviewRulerLane = require('vscode').OverviewRulerLane;

const OVERVIEW_RULER_COLOUR = 'violet';

class DecorationRegistry {

    constructor(params) {
        this._colourRegistry = params.colourRegistry;
        this._window = params.window;
        this._textDecorationMap = {};
    }

    inquireByPattern(pattern) {
        const decoration = this._textDecorationMap[this._getId(pattern)];
        return _.get(decoration, 'decorationType', null);
    }

    issue(pattern) {
        const colour = this._colourRegistry.issue();
        const decorationType = this._generateDecorationType(colour);
        this._textDecorationMap[this._getId(pattern)] = {pattern, colour, decorationType};
        return decorationType;
    }

    revoke(pattern) {
        const patternId = this._getId(pattern);
        const decoration = this._textDecorationMap[patternId];
        this._colourRegistry.revoke(decoration.colour);
        this._textDecorationMap[patternId] = null;
    }

    _getId(pattern) {
        const patternType = pattern instanceof RegExp ? 'RegExp' : 'String';
        return `${patternType}:${pattern.toString()}`;
    }

    retrieveAll() {
        return _.map(_.pickBy(this._textDecorationMap), value => ({
            pattern: value.pattern,
            decorationType: value.decorationType
        }));
    }

    _generateDecorationType(colour) {
        return this._window.createTextEditorDecorationType({
            backgroundColor: colour,
            overviewRulerColor: OVERVIEW_RULER_COLOUR,
            overviewRulerLane: OverviewRulerLane.Center
        });
    }

}

module.exports = DecorationRegistry;
