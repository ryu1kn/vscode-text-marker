
export default class ColourRegistry {
    private readonly configStore: any;
    private inUseColours: any[];

    constructor(params) {
        this.configStore = params.configStore;
        this.inUseColours = [];
    }

    issue() {
        const colours = this.configStore.get('highlightColors');
        const availableColour = colours.find(colour => !this.inUseColours.includes(colour));
        const newColour = availableColour || this.configStore.get('defaultHighlightColor');
        this.inUseColours = this.inUseColours.concat(newColour);
        return newColour;
    }

    revoke(colour) {
        this.inUseColours = this.inUseColours.filter(c => c !== colour);
    }

}
