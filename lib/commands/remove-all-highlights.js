
class RemoveAllHighlightsCommand {

    constructor(params) {
        this._logger = params.logger;
        this._decorationOperatorFactory = params.decorationOperatorFactory;
        this._windowComponent = params.windowComponent;
    }

    execute() {
        try {
            const visibleEditors = this._windowComponent.visibleTextEditors;
            const decorationOperator = this._decorationOperatorFactory.create(visibleEditors);
            decorationOperator.removeAllDecorations();
        } catch (e) {
            this._handleError(e);
        }
    }

    _handleError(e) {
        this._logger.error(e.stack);
    }

}

module.exports = RemoveAllHighlightsCommand;
