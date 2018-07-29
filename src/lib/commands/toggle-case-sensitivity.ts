import {PatternAction} from '../const';

export default class ToggleCaseSensitivityCommand {
    private readonly _decorationOperatorFactory: any;
    private readonly _highlightPatternPicker: any;

    constructor(params) {
        this._decorationOperatorFactory = params.decorationOperatorFactory;
        this._highlightPatternPicker = params.highlightPatternPicker;
    }

    async execute() {
        const decorationId = await this._highlightPatternPicker.pick('Select a pattern to toggle case sensitivity');
        if (!decorationId) return;

        const decorationOperator = this._decorationOperatorFactory.createForVisibleEditors();
        decorationOperator.updateDecorationWithPatternAction(decorationId, PatternAction.TOGGLE_CASE_SENSITIVITY);
    }

}
