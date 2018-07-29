import {OverviewRulerLane} from 'vscode';
import TextDecorationCollection from './text-decoration-collection';

const getColorContrast = require('../../lib-3rd-party/dynamic-contrast');

const OVERVIEW_RULER_COLOUR = 'violet';

export default class DecorationRegistry {
    private _colourRegistry: any;
    private _configStore: any;
    private _window: any;
    private _textDecorationMap: any;

    constructor(params) {
        this._colourRegistry = params.colourRegistry;
        this._configStore = params.configStore;
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
        return this._window.createTextEditorDecorationType(
            Object.assign(
                {
                    backgroundColor: colour,
                    borderRadius: '.2em',
                    overviewRulerColor: this._useHighlightColorOnRuler ? colour : OVERVIEW_RULER_COLOUR,
                    overviewRulerLane: OverviewRulerLane.Center
                },
                this._autoSelectDistinctiveTextColor && {color: getColorContrast(colour)}
            )
        );
    }

    get _useHighlightColorOnRuler() {
        return this._configStore.get('useHighlightColorOnRuler');
    }

    get _autoSelectDistinctiveTextColor() {
        return this._configStore.get('autoSelectDistinctiveTextColor');
    }

}
