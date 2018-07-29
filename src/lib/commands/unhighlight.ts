
export default class UnhighlightCommand {
    private readonly decorationOperatorFactory: any;
    private readonly highlightPatternPicker: any;

    constructor(params) {
        this.decorationOperatorFactory = params.decorationOperatorFactory;
        this.highlightPatternPicker = params.highlightPatternPicker;
    }

    async execute() {
        const decorationId = await this.highlightPatternPicker.pick('Select a pattern to remove highlight');
        if (!decorationId) return;

        const decorationOperator = this.decorationOperatorFactory.createForVisibleEditors();
        decorationOperator.removeDecoration(decorationId);
    }

}
