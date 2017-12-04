
class SaveAllHighlightsCommand {

    constructor(params) {
        this._configStore = params.configStore;
        this._decorationRegistry = params.decorationRegistry;
    }

    execute() {
        const decorations = this._decorationRegistry.retrieveAll();
        return this._configStore.set('savedHighlights', decorations);
    }

}

module.exports = SaveAllHighlightsCommand;
