
export default class RemoveAllHighlightsCommand {
    private readonly _decorationOperatorFactory: any;

    constructor(params) {
        this._decorationOperatorFactory = params.decorationOperatorFactory;
    }

    execute() {
        const decorationOperator = this._decorationOperatorFactory.createForVisibleEditors();
        decorationOperator.removeAllDecorations();
    }

}
