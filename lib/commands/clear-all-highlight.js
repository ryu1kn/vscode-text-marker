
class ClearAllHighlightCommand {

    constructor(params) {
        this._vsWindow = params.vsWindow;
        this._logger = params.logger;
        this._decorationOperatorFactory = params.decorationOperatorFactory;
    }

    execute() {
        try {
            const visibleEditors = this._vsWindow.visibleTextEditors;
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

module.exports = ClearAllHighlightCommand;
