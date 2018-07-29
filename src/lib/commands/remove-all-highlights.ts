
export default class RemoveAllHighlightsCommand {
    private readonly decorationOperatorFactory: any;

    constructor(params) {
        this.decorationOperatorFactory = params.decorationOperatorFactory;
    }

    execute() {
        const decorationOperator = this.decorationOperatorFactory.createForVisibleEditors();
        decorationOperator.removeAllDecorations();
    }

}
