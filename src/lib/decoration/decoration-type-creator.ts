import {OverviewRulerLane, TextEditorDecorationType} from 'vscode';
import ConfigStore from '../config-store';
import * as vscode from 'vscode';

const OVERVIEW_RULER_COLOUR = 'violet';
const getColorContrast = require('../../../lib-3rd-party/dynamic-contrast');
const rgba = require('color-rgba');

const isValidColour = (rgba: number[]): boolean => rgba.length !== 0;

export default class DecorationTypeCreator {
    private readonly configStore: ConfigStore;
    private readonly window: typeof vscode.window;

    constructor(configStore: ConfigStore,
                window: typeof vscode.window,) {
        this.configStore = configStore;
        this.window = window;
    }

    create(colour: string): TextEditorDecorationType {
        return this.window.createTextEditorDecorationType(
            Object.assign(
                {
                    backgroundColor: this.getBackgroundColor(colour),
                    borderRadius: '.2em',
                    overviewRulerColor: this.configStore.useHighlightColorOnRuler ? colour : OVERVIEW_RULER_COLOUR,
                    overviewRulerLane: OverviewRulerLane.Center
                },
                this.configStore.autoSelectDistinctiveTextColor && {color: getColorContrast(colour)}
            )
        );
    }

    private getBackgroundColor(colour: string): string {
        if (colour.startsWith('rgba(') || colour.startsWith('hsla(')) return colour;

        const c = rgba(colour);
        if (!isValidColour(c)) return colour;
        return `rgba(${c[0]},${c[1]},${c[2]},${this.configStore.defaultHighlightOpacity})`;
    }
}
