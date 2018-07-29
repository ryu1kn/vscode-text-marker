
export default class ColourRegistry {
    private _configStore: any;
    private _inUseColours: any[];

    constructor(params) {
        this._configStore = params.configStore;
        this._inUseColours = [];
    }

    issue() {
        const colours = this._configStore.get('highlightColors');
        const availableColour = colours.find(colour => !this._inUseColours.includes(colour));
        const newColour = availableColour || this._configStore.get('defaultHighlightColor');
        this._inUseColours = this._inUseColours.concat(newColour);
        return newColour;
    }

    revoke(colour) {
        this._inUseColours = this._inUseColours.filter(c => c !== colour);
    }

}
