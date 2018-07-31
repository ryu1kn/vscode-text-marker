import {Event} from './const';
import DecorationEntryParser from './decoration-entry-parser';
import ConfigStore from './config-store';
import DecorationOperatorFactory from './decoration-operator-factory';
import EventEmitter = NodeJS.EventEmitter;
import PatternFactory from './pattern-factory';

export default class SavedHighlightsRestorer {
    private readonly configStore: ConfigStore;
    private readonly decorationOperatorFactory: DecorationOperatorFactory;
    private readonly patternFactory: PatternFactory;
    private readonly eventBus: EventEmitter;
    private readonly decorationEntryParser: DecorationEntryParser;

    constructor(configStore, decorationOperatorFactory, patternFactory, eventBus) {
        this.configStore = configStore;
        this.decorationOperatorFactory = decorationOperatorFactory;
        this.patternFactory = patternFactory;
        this.eventBus = eventBus;

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
