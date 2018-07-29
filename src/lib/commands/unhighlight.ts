import HighlightPatternPicker from '../highlight-pattern-picker';
import DecorationOperatorFactory from '../decoration-operator-factory';

export default class UnhighlightCommand {
    private readonly decorationOperatorFactory: DecorationOperatorFactory;
    private readonly highlightPatternPicker: HighlightPatternPicker;

    constructor(decorationOperatorFactory, highlightPatternPicker) {
        this.decorationOperatorFactory = decorationOperatorFactory;
        this.highlightPatternPicker = highlightPatternPicker;
    }

    async execute() {
        const decorationId = await this.highlightPatternPicker.pick('Select a pattern to remove highlight');
        if (!decorationId) return;

        const decorationOperator = this.decorationOperatorFactory.createForVisibleEditors();
        decorationOperator.removeDecoration(decorationId);
    }

}
