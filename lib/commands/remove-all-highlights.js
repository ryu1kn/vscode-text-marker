
class RemoveAllHighlightsCommand {

    constructor(params) {
        this._decorationOperatorFactory = params.decorationOperatorFactory;
    }

    execute() {
        const decorationOperator = this._decorationOperatorFactory.createForVisibleEditors();
        decorationOperator.removeAllDecorations();
    }

}

module.exports = RemoveAllHighlightsCommand;
