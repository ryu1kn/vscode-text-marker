import {OverviewRulerLane, TextEditorDecorationType} from 'vscode';
import ConfigStore from '../config-store';
import WindowComponent from '../vscode/window';

const OVERVIEW_RULER_COLOUR = 'violet';
const rgba = require('color-rgba');
const webColors = require('color-name');

/**
 * Returns suggested contrast grey scale color for the color (hex/rgba) given.
 * Takes advantage of YIQ: https://en.wikipedia.org/wiki/YIQ
 * Inspired by: http://24ways.org/2010/calculating-color-contrast/
 *
 * @param {string} color A valid hex or rgb value, examples::
 *                         #000, #000000, 000, 000000
 *                         rgb(255, 255, 255), rgba(255, 255, 255),
 *                         rgba(255, 255, 255, 1)
 *                         blue, green, red
 * @return {string} in the form of #RRGGBB
 */
function getColorContrast(color: string): string {
    const rgbExp = /^rgba?[\s+]?\(\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*(?:,\s*([\d.]+)\s*)?\)/im;
    const hexExp = /^(?:#)|([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/igm;
    const rgb = color.match(rgbExp);
    const hex = color.match(hexExp);
    let [r, g, b] = [0, 0, 0];
    if (rgb) {
        r = parseInt(rgb[1], 10);
        g = parseInt(rgb[2], 10);
        b = parseInt(rgb[3], 10);
    } else if (hex)  {
        let rgbHex: string;
        if (hex.length > 1) {
            rgbHex = hex[1];
        } else {
            rgbHex = hex[0];
        }
        if (rgbHex.length === 3) {
            rgbHex = rgbHex[0] + rgbHex[0] + rgbHex[1] + rgbHex[1] + rgbHex[2] + rgbHex[2];
        }
        r = parseInt(rgbHex.substr(0, 2), 16);
        g = parseInt(rgbHex.substr(2, 2), 16);
        b = parseInt(rgbHex.substr(4, 2), 16);
    } else {
        const rgbVec = webColors[color.toLowerCase()];
        if (rgbVec) {
            [r, g, b] = rgbVec;
        } else {
            return '#000000';
        }
    }
    let yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    if (yiq >= 128) {
        yiq -= 128;
    } else {
        yiq += 128;
    }
    const contrastColor = yiq << 16 | yiq << 8 | yiq;
    return '#' + ('00000' + contrastColor.toString(16)).substr(-6);
}

const isValidColour = (rgba: number[]): boolean => rgba.length !== 0;

export default class DecorationTypeCreator {
    private readonly configStore: ConfigStore;
    private readonly window: WindowComponent;

    constructor(configStore: ConfigStore,
                window: WindowComponent) {
        this.configStore = configStore;
        this.window = window;
    }

    create(colour: string): TextEditorDecorationType {
        const backgroundColour = this.getBackgroundColor(colour);
        const overviewRulerColor = this.configStore.useHighlightColorOnRuler ?
            backgroundColour : this.getBackgroundColor(OVERVIEW_RULER_COLOUR);
        return this.window.createTextEditorDecorationType(
            Object.assign(
                {
                    backgroundColor: backgroundColour,
                    borderRadius: '.2em',
                    overviewRulerColor: overviewRulerColor,
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
