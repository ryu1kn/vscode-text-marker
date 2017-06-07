
class RemoveAllHighlightsCommand {

    constructor(params) {
        this._decorationOperatorFactory = params.decorationOperatorFactory;
        this._windowComponent = params.windowComponent;
    }

    execute() {
        const visibleEditors = this._windowComponent.visibleTextEditors;
        const decorationOperator = this._decorationOperatorFactory.create(visibleEditors);
        decorationOperator.removeAllDecorations();
    }

}

module.exports = RemoveAllHighlightsCommand;
