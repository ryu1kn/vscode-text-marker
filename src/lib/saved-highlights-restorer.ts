import {Event} from './const';
import DecorationEntryParser from './decoration-entry-parser';

export default class SavedHighlightsRestorer {
    private readonly configStore: any;
    private readonly decorationOperatorFactory: any;
    private readonly patternFactory: any;
    private readonly eventBus: any;
    private readonly decorationEntryParser: any;

    constructor(params) {
        this.configStore = params.configStore;
        this.decorationOperatorFactory = params.decorationOperatorFactory;
        this.patternFactory = params.patternFactory;
        this.eventBus = params.eventBus;

        this.decorationEntryParser = new DecorationEntryParser();
        this.registerListeners();
    }

    private registerListeners() {
        this.eventBus.on(Event.EXTENSION_READY, this.restore.bind(this));
    }

    private restore() {
        const decorationsData = this.configStore.get('savedHighlights');
        const decorationOperator = this.decorationOperatorFactory.createForVisibleEditors();
        decorationsData.forEach(decorationData => this.addDecoration(decorationData, decorationOperator));
    }

    private addDecoration(decorationData, decorationOperator) {
        const patternData = this.decorationEntryParser.getPattern(decorationData);
        const pattern = this.patternFactory.create(patternData);
        decorationOperator.addDecoration(pattern);
    }

}
