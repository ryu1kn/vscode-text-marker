import {Event} from './const';
import DecorationEntryParser from './decoration-entry-parser';

export default class SavedHighlightsRestorer {
    private _configStore: any;
    private _decorationOperatorFactory: any;
    private _patternFactory: any;
    private _eventBus: any;
    private _decorationEntryParser: any;

    constructor(params) {
        this._configStore = params.configStore;
        this._decorationOperatorFactory = params.decorationOperatorFactory;
        this._patternFactory = params.patternFactory;
        this._eventBus = params.eventBus;

        this._decorationEntryParser = new DecorationEntryParser();
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
        const patternData = this._decorationEntryParser.getPattern(decorationData);
        const pattern = this._patternFactory.create(patternData);
        decorationOperator.addDecoration(pattern);
    }

}
