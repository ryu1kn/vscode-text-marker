import ConfigStore from './config-store';

export default class ColourRegistry {
    private readonly configStore: ConfigStore;
    private inUseColours: string[];

    constructor(configStore) {
        this.configStore = configStore;
        this.inUseColours = [];
    }

    issue() {
        const colours = this.configStore.get('highlightColors') as string[];
        const availableColour = colours.find(colour => !this.inUseColours.includes(colour));
        const newColour = availableColour || this.configStore.get('defaultHighlightColor');
        this.inUseColours = this.inUseColours.concat(newColour);
        return newColour;
    }

    revoke(colour) {
        this.inUseColours = this.inUseColours.filter(c => c !== colour);
    }

}
