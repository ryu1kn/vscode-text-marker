import DecorationEntryFormatter from '../decoration-entry-formatter';
import ConfigStore from '../config-store';
import DecorationRegistry from '../decoration-registry';

export default class SaveAllHighlightsCommand {
    private readonly configStore: ConfigStore;
    private readonly decorationRegistry: DecorationRegistry;
    private readonly decorationEntryFormatter: DecorationEntryFormatter;

    constructor(configStore: ConfigStore, decorationRegistry: DecorationRegistry) {
        this.configStore = configStore;
        this.decorationRegistry = decorationRegistry;

        this.decorationEntryFormatter = new DecorationEntryFormatter();
    }

    execute() {
        const decorations = this.decorationRegistry.retrieveAll()
            .map(decoration => this.decorationEntryFormatter.format(decoration));
        return this.configStore.set('savedHighlights', decorations);
    }

}
