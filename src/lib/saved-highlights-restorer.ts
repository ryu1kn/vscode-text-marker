import {Event} from './const';
import DecorationEntryParser from './decoration/decoration-entry-parser';
import ConfigStore from './config-store';
import DecorationOperatorFactory from './decoration/decoration-operator-factory';
import EventEmitter = NodeJS.EventEmitter;
import PatternFactory from './pattern/pattern-factory';
import {Highlight} from './entities/highlight';
import DecorationOperator from './decoration/decoration-operator';
import MatchingModeRegistry from './matching-mode-registry';

export default class SavedHighlightsRestorer {
    private readonly configStore: ConfigStore;
    private readonly decorationOperatorFactory: DecorationOperatorFactory;
    private readonly patternFactory: PatternFactory;
    private readonly eventBus: EventEmitter;
    private readonly decorationEntryParser: DecorationEntryParser;

    constructor(configStore: ConfigStore,
                decorationOperatorFactory: DecorationOperatorFactory,
                matchingModeRegistry: MatchingModeRegistry,
                eventBus: EventEmitter) {
        this.configStore = configStore;
        this.decorationOperatorFactory = decorationOperatorFactory;
        this.patternFactory = new PatternFactory(matchingModeRegistry);
        this.eventBus = eventBus;

        this.decorationEntryParser = new DecorationEntryParser();
        this.registerListeners();
    }

    private registerListeners() {
        this.eventBus.on(Event.EXTENSION_READY, this.restore.bind(this));
    }

    private restore() {
        const decorationsData = this.configStore.savedHighlights;
        const decorationOperator = this.decorationOperatorFactory.createForVisibleEditors();
        decorationsData.forEach(decorationData => this.addDecoration(decorationData, decorationOperator));
    }

    private addDecoration(decorationData: Highlight, decorationOperator: DecorationOperator) {
        const patternData = this.decorationEntryParser.getPattern(decorationData);
        const pattern = this.patternFactory.create(patternData);
        // todo: color vs colour
        // todo: should color be in pattern?? should Highlight.pattern be of type Pattern? what's current diff?
        decorationOperator.addDecoration(pattern, decorationData.pattern.colour);
    }

}
