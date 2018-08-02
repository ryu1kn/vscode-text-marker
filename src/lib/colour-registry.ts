import ConfigStore from './config-store';

export default class ColourRegistry {
    private readonly configStore: ConfigStore;
    private inUseColours: string[];

    constructor(configStore: ConfigStore) {
        this.configStore = configStore;
        this.inUseColours = [];
    }

    issue(): string {
        const colours = this.configStore.highlightColors;
        const availableColour = colours.find(colour => !this.inUseColours.includes(colour));
        const newColour = availableColour || this.configStore.defaultHighlightColor;
        this.inUseColours = this.inUseColours.concat(newColour);
        return newColour;
    }

    revoke(colour: string): void {
        this.inUseColours = this.inUseColours.filter(c => c !== colour);
    }

}
