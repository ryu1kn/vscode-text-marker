import {PatternAction} from '../const';
import HighlightPatternPicker from '../highlight-pattern-picker';
import DecorationOperatorFactory from '../decoration-operator-factory';

export default class ToggleWholeMatchCommand {
    private readonly decorationOperatorFactory: DecorationOperatorFactory;
    private readonly highlightPatternPicker: HighlightPatternPicker;

    constructor(decorationOperatorFactory, highlightPatternPicker) {
        this.decorationOperatorFactory = decorationOperatorFactory;
        this.highlightPatternPicker = highlightPatternPicker;
    }

    async execute() {
        const decorationId = await this.highlightPatternPicker.pick('Select a pattern to toggle partial/whole match');
        if (!decorationId) return;

        const decorationOperator = this.decorationOperatorFactory.createForVisibleEditors();
        decorationOperator.updateDecorationWithPatternAction(decorationId, PatternAction.TOGGLE_WHOLE_MATCH);
    }

}
