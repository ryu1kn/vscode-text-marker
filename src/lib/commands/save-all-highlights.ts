import DecorationEntryFormatter from '../decoration-entry-formatter';

export default class SaveAllHighlightsCommand {
    private readonly configStore: any;
    private readonly decorationRegistry: any;
    private readonly decorationEntryFormatter: DecorationEntryFormatter;

    constructor(params) {
        this.configStore = params.configStore;
        this.decorationRegistry = params.decorationRegistry;

        this.decorationEntryFormatter = new DecorationEntryFormatter();
    }

    execute() {
        const decorations = this.decorationRegistry.retrieveAll()
            .map(decoration => this.decorationEntryFormatter.format(decoration));
        return this.configStore.set('savedHighlights', decorations);
    }

}
