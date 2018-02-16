
const DecorationEntryFormatter = require('../decoration-entry-formatter');

class SaveAllHighlightsCommand {

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

module.exports = SaveAllHighlightsCommand;
