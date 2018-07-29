import {PatternAction} from '../const';

export default class ToggleCaseSensitivityCommand {
    private readonly decorationOperatorFactory: any;
    private readonly highlightPatternPicker: any;

    constructor(params) {
        this.decorationOperatorFactory = params.decorationOperatorFactory;
        this.highlightPatternPicker = params.highlightPatternPicker;
    }

    async execute() {
        const decorationId = await this.highlightPatternPicker.pick('Select a pattern to toggle case sensitivity');
        if (!decorationId) return;

        const decorationOperator = this.decorationOperatorFactory.createForVisibleEditors();
        decorationOperator.updateDecorationWithPatternAction(decorationId, PatternAction.TOGGLE_CASE_SENSITIVITY);
    }

}
