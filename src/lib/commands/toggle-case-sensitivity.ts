import {PatternAction} from '../const';
import DecorationOperatorFactory from '../decoration-operator-factory';
import HighlightPatternPicker from '../highlight-pattern-picker';

export default class ToggleCaseSensitivityCommand {
    private readonly decorationOperatorFactory: DecorationOperatorFactory;
    private readonly highlightPatternPicker: HighlightPatternPicker;

    constructor(decorationOperatorFactory: DecorationOperatorFactory, highlightPatternPicker: HighlightPatternPicker) {
        this.decorationOperatorFactory = decorationOperatorFactory;
        this.highlightPatternPicker = highlightPatternPicker;
    }

    async execute() {
        const decorationId = await this.highlightPatternPicker.pick('Select a pattern to toggle case sensitivity');
        if (!decorationId) return;

        const decorationOperator = this.decorationOperatorFactory.createForVisibleEditors();
        decorationOperator.updateDecorationWithPatternAction(decorationId, PatternAction.TOGGLE_CASE_SENSITIVITY);
    }

}
