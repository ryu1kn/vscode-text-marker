import {OverviewRulerLane} from 'vscode';
import TextDecorationCollection from './text-decoration-collection';

const getColorContrast = require('../../lib-3rd-party/dynamic-contrast');

const OVERVIEW_RULER_COLOUR = 'violet';

export default class DecorationRegistry {
    private readonly colourRegistry: any;
    private readonly configStore: any;
    private readonly window: any;
    private readonly textDecorationMap: any;

    constructor(params) {
        this.colourRegistry = params.colourRegistry;
        this.configStore = params.configStore;
        this.window = params.window;

        this.textDecorationMap = new TextDecorationCollection({
            generateUuid: params.generateUuid
        });
    }

    inquireById(decorationId) {
        return this.textDecorationMap.get(decorationId);
    }

    inquireByPattern(pattern) {
        const isSamePattern = decoration => decoration.pattern.equalTo(pattern);
        return this.textDecorationMap.find(isSamePattern);
    }

    issue(pattern) {
        const decoration = this.inquireByPattern(pattern);
        if (decoration) return null;

        const colour = this.colourRegistry.issue();
        const decorationType = this.generateDecorationType(colour);
        return this.textDecorationMap.add({pattern, colour, decorationType});
    }

    updatePattern(decorationId, newPattern) {
        const decoration = this.textDecorationMap.get(decorationId);
        decoration.pattern = newPattern;
        return decoration;
    }

    revoke(decorationId) {
        const decoration = this.textDecorationMap.get(decorationId);
        this.colourRegistry.revoke(decoration.colour);
        this.textDecorationMap.remove(decorationId);
    }

    retrieveAll() {
        return this.textDecorationMap.toList();
    }

    private generateDecorationType(colour) {
        return this.window.createTextEditorDecorationType(
            Object.assign(
                {
                    backgroundColor: colour,
                    borderRadius: '.2em',
                    overviewRulerColor: this.useHighlightColorOnRuler ? colour : OVERVIEW_RULER_COLOUR,
                    overviewRulerLane: OverviewRulerLane.Center
                },
                this.autoSelectDistinctiveTextColor && {color: getColorContrast(colour)}
            )
        );
    }

    private get useHighlightColorOnRuler() {
        return this.configStore.get('useHighlightColorOnRuler');
    }

    private get autoSelectDistinctiveTextColor() {
        return this.configStore.get('autoSelectDistinctiveTextColor');
    }

}
