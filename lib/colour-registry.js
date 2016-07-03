
'use strict';

const _ = require('lodash');

const DEFAULT_COLOUR = 'gray';

class ColourRegistry {
    constructor(params) {
        this._workspace = params.workspace;
        this._inUseColours = [];
    }

    issue() {
        const colourList = this._workspace.getConfiguration('textmarker.colorList');
        const availableColour = colourList.find(colour => !_.includes(this._inUseColours, colour));
        const newColour = availableColour || DEFAULT_COLOUR;
        this._inUseColours = this._inUseColours.concat(newColour);
        return newColour;
    }

    revoke(colour) {
        this._inUseColours = this._inUseColours.filter(c => c !== colour);
    }
}

module.exports = ColourRegistry;
