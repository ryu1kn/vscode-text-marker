import DecorationEntryFormatter from '../decoration-entry-formatter';

export default class SaveAllHighlightsCommand {
    private readonly _configStore: any;
    private readonly _decorationRegistry: any;
    private readonly _decorationEntryFormatter: DecorationEntryFormatter;

    constructor(params) {
        this._configStore = params.configStore;
        this._decorationRegistry = params.decorationRegistry;

        this._decorationEntryFormatter = new DecorationEntryFormatter();
    }

    execute() {
        const decorations = this._decorationRegistry.retrieveAll()
            .map(decoration => this._decorationEntryFormatter.format(decoration));
        return this._configStore.set('savedHighlights', decorations);
    }

}
