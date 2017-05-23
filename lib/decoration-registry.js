
const _ = require('lodash');
const OverviewRulerLane = require('vscode').OverviewRulerLane;

const OVERVIEW_RULER_COLOUR = 'violet';

class DecorationRegistry {

    constructor(params) {
        this._colourRegistry = params.colourRegistry;
        this._window = params.window;
        this._generateUuid = params.generateUuid;

        this._textDecorationMap = {};
    }

    inquireById(decorationId) {
        return this._buildExternalOutput(decorationId);
    }

    inquireByPattern(pattern) {
        const decorationId = _.findKey(this._textDecorationMap, {pattern});
        return decorationId ? this._buildExternalOutput(decorationId) : null;
    }

    _buildExternalOutput(decorationId) {
        const decoration = Object.assign({id: decorationId}, this._textDecorationMap[decorationId]);
        return _.pick(decoration, ['id', 'decorationType']);
    }

    issue(pattern) {
        const colour = this._colourRegistry.issue();
        const id = this._generateUuid();
        const decorationType = this._generateDecorationType(colour);
        this._textDecorationMap[id] = {pattern, colour, decorationType};
        return {id, decorationType};
    }

    revoke(decorationId) {
        const decoration = this._textDecorationMap[decorationId];
        this._colourRegistry.revoke(decoration.colour);
        this._textDecorationMap[decorationId] = null;
    }

    retrieveAll() {
        return _.reduce(this._textDecorationMap, (result, value, key) => {
            if (!value) return result;
            return result.concat({
                id: key,
                pattern: value.pattern,
                decorationType: value.decorationType
            });
        }, []);
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
