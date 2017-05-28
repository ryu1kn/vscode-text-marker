
class UnhighlightCommand {

    constructor(params) {
        this._vsWindow = params.vsWindow;
        this._logger = params.logger;
        this._decorationOperatorFactory = params.decorationOperatorFactory;
        this._highlightPatternPicker = params.highlightPatternPicker;
    }

    execute() {
        return Promise.resolve()
            .then(() => this._highlightPatternPicker.pick('Select a pattern to remove highlight'))
            .then(decorationId => {
                if (!decorationId) return;

                const visibleEditors = this._vsWindow.visibleTextEditors;
                const decorationOperator = this._decorationOperatorFactory.create(visibleEditors);
                decorationOperator.removeDecoration(decorationId);
            })
            .catch(e => this._handleError(e));
    }

    _handleError(e) {
        this._logger.error(e.stack);
    }

}

module.exports = UnhighlightCommand;
