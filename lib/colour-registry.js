
'use strict';

const _ = require('lodash');

class ColourRegistry {
    constructor(params) {
        this._workspace = params.workspace;
        this._inUseColours = [];
    }

    issue() {
        const colourList = this._workspace.getConfiguration('textmarker.colorList');
        const newColour = colourList.find(colour => !_.includes(this._inUseColours, colour));
        this._inUseColours = this._inUseColours.concat(newColour);
        return newColour;
    }

    revoke(colour) {
        this._inUseColours = this._inUseColours.filter(c => c !== colour);
    }
}

module.exports = ColourRegistry;
