import {OverviewRulerLane, TextEditorDecorationType} from 'vscode';
import TextDecorationCollection from './text-decoration-collection';
import ConfigStore from './config-store';
import ColourRegistry from './colour-registry';
import * as vscode from 'vscode';
import Pattern from './patterns/pattern';
import {Decoration} from './entities/decoration';
import {Option} from 'fp-ts/lib/Option';

const getColorContrast = require('../../lib-3rd-party/dynamic-contrast');

const OVERVIEW_RULER_COLOUR = 'violet';

export default class DecorationRegistry {
    private readonly colourRegistry: ColourRegistry;
    private readonly configStore: ConfigStore;
    private readonly window: typeof vscode.window;
    private readonly textDecorationMap: TextDecorationCollection;

    constructor(configStore: ConfigStore,
                window: typeof vscode.window,
                generateUuid: () => string) {
        this.colourRegistry = new ColourRegistry(configStore);
        this.configStore = configStore;
        this.window = window;

        this.textDecorationMap = new TextDecorationCollection(generateUuid);
    }

    inquireById(decorationId: string): Option<Decoration> {
        return this.textDecorationMap.get(decorationId);
    }

    inquireByPattern(pattern: Pattern): Option<Decoration> {
        const isSamePattern = (decoration: Decoration) => decoration.pattern.equalTo(pattern);
        return this.textDecorationMap.find(isSamePattern);
    }

    issue(pattern: Pattern): Decoration | null {
        const decoration = this.inquireByPattern(pattern);
        if (decoration.isSome()) return null;

        const colour = this.colourRegistry.issue();
        const decorationType = this.generateDecorationType(colour);
        return this.textDecorationMap.add(pattern, colour, decorationType);
    }

    updatePattern(decorationId: string, newPattern: Pattern): Option<Decoration> {
        const decoration = this.textDecorationMap.get(decorationId);
        return decoration.map(d => {
            d.pattern = newPattern;
            return d;
        });
    }

    revoke(decorationId: string): void {
        const decoration = this.textDecorationMap.get(decorationId);
        decoration.map(d => {
            this.colourRegistry.revoke(d.colour);
            this.textDecorationMap.remove(decorationId);
        });
    }

    retrieveAll() {
        return this.textDecorationMap.toList();
    }

    private generateDecorationType(colour: string): TextEditorDecorationType {
        return this.window.createTextEditorDecorationType(
            Object.assign(
                {
                    backgroundColor: colour,
                    borderRadius: '.2em',
                    overviewRulerColor: this.configStore.useHighlightColorOnRuler ? colour : OVERVIEW_RULER_COLOUR,
                    overviewRulerLane: OverviewRulerLane.Center
                },
                this.configStore.autoSelectDistinctiveTextColor && {color: getColorContrast(colour)}
            )
        );
    }

}
