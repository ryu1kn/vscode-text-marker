
export default class UnhighlightCommand {
    private _decorationOperatorFactory: any;
    private _highlightPatternPicker: any;

    constructor(params) {
        this._decorationOperatorFactory = params.decorationOperatorFactory;
        this._highlightPatternPicker = params.highlightPatternPicker;
    }

    async execute() {
        const decorationId = await this._highlightPatternPicker.pick('Select a pattern to remove highlight');
        if (!decorationId) return;

        const decorationOperator = this._decorationOperatorFactory.createForVisibleEditors();
        decorationOperator.removeDecoration(decorationId);
    }

}
