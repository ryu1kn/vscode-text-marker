
const OverviewRulerLane = require('vscode').OverviewRulerLane;
const TextDecorationCollection = require('./text-decoration-collection');
const getColorContrast = require('./dynamic-contrast');

const OVERVIEW_RULER_COLOUR = 'violet';

class DecorationRegistry {

    constructor(params) {
        this._colourRegistry = params.colourRegistry;
        this._window = params.window;

        this._textDecorationMap = new TextDecorationCollection({
            generateUuid: params.generateUuid
        });
    }

    inquireById(decorationId) {
        return this._textDecorationMap.get(decorationId);
    }

    inquireByPattern(pattern) {
        const isSamePattern = decoration => decoration.pattern.equalTo(pattern);
        return this._textDecorationMap.find(isSamePattern);
    }

    issue(pattern) {
        const decoration = this.inquireByPattern(pattern);
        if (decoration) return null;

        const colour = this._colourRegistry.issue();
        const decorationType = this._generateDecorationType(colour);
        return this._textDecorationMap.add({pattern, colour, decorationType});
    }

    updatePattern(decorationId, newPattern) {
        const decoration = this._textDecorationMap.get(decorationId);
        decoration.pattern = newPattern;
        return decoration;
    }

    revoke(decorationId) {
        const decoration = this._textDecorationMap.get(decorationId);
        this._colourRegistry.revoke(decoration.colour);
        this._textDecorationMap.remove(decorationId);
    }

    retrieveAll() {
        return this._textDecorationMap.toList();
    }

    _generateDecorationType(colour) {
        return this._window.createTextEditorDecorationType({
            backgroundColor: colour,
            color: getColorContrast(colour),
            borderRadius: '3px',
            overviewRulerColor: OVERVIEW_RULER_COLOUR,
            overviewRulerLane: OverviewRulerLane.Center
        });
    }

}

module.exports = DecorationRegistry;
