
const {Event} = require('./const');

class SavedHighlightsRestorer {

    constructor(params) {
        this._configStore = params.configStore;
        this._decorationOperatorFactory = params.decorationOperatorFactory;
        this._patternFactory = params.patternFactory;
        this._eventBus = params.eventBus;

        this._registerListeners();
    }

    _registerListeners() {
        this._eventBus.on(Event.EXTENSION_READY, this._restore.bind(this));
    }

    _restore() {
        const decorationsData = this._configStore.get('savedHighlights');
        const decorationOperator = this._decorationOperatorFactory.createForVisibleEditors();
        decorationsData.forEach(decorationData => this._addDecoration(decorationData, decorationOperator));
    }

    _addDecoration(decorationData, decorationOperator) {
        const pattern = this._patternFactory.create(decorationData.pattern);
        decorationOperator.addDecoration(pattern);
    }

}

module.exports = SavedHighlightsRestorer;
