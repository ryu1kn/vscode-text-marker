
const _ = require('lodash');

const DEFAULT_COLOUR = 'gray';

class ColourRegistry {

    constructor(params) {
        this._configStore = params.configStore;
        this._inUseColours = [];
    }

    issue() {
        const colours = this._configStore.get('highlightColors');
        const availableColour = colours.find(colour => !_.includes(this._inUseColours, colour));
        const newColour = availableColour || DEFAULT_COLOUR;
        this._inUseColours = this._inUseColours.concat(newColour);
        return newColour;
    }

    revoke(colour) {
        this._inUseColours = this._inUseColours.filter(c => c !== colour);
    }

}

module.exports = ColourRegistry;
