
const _ = require('lodash');
const OverviewRulerLane = require('vscode').OverviewRulerLane;
const TextDecorationCollection = require('./text-decoration-collection');

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
        const decoration = this._textDecorationMap.get(decorationId);
        return decoration && this._buildDecorationInfo(decoration);
    }

    inquireByPattern(pattern) {
        const isSamePattern = decoration => decoration.pattern.equalTo(pattern);
        const decoration = this._textDecorationMap.find(isSamePattern);
        return decoration && this._buildDecorationInfo(decoration);
    }

    issue(pattern) {
        const decoration = this.inquireByPattern(pattern);
        if (decoration) return null;

        const colour = this._colourRegistry.issue();
        const decorationType = this._generateDecorationType(colour);
        const newDecoration = this._textDecorationMap.add({pattern, colour, decorationType});
        return this._buildDecorationInfo(newDecoration);
    }

    updatePattern(decorationId, newPattern) {
        const decoration = this._textDecorationMap.get(decorationId);
        decoration.pattern = newPattern;
        return this._buildDecorationInfo(decoration);
    }

    revoke(decorationId) {
        const decoration = this._textDecorationMap.get(decorationId);
        this._colourRegistry.revoke(decoration.colour);
        this._textDecorationMap.remove(decorationId);
    }

    retrieveAll() {
        return this._textDecorationMap.toList()
            .map(this._buildDecorationInfo);
    }

    _buildDecorationInfo(decoration) {
        return _.pick(decoration, ['id', 'decorationType', 'pattern']);
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
