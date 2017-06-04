
class HighlightUsingRegexCommand {

    constructor(params) {
        this._logger = params.logger;
        this._decorationOperatorFactory = params.decorationOperatorFactory;
        this._regexReader = params.regexReader;
        this._windowComponent = params.windowComponent;
    }

    execute() {
        return Promise.resolve()
            .then(() => this._regexReader.read())
            .then(regex => {
                if (!regex) return;

                const visibleEditors = this._windowComponent.visibleTextEditors;
                const decorationOperator = this._decorationOperatorFactory.create(visibleEditors);
                decorationOperator.addDecoration(regex);
            })
            .catch(e => this._handleError(e));
    }

    _handleError(e) {
        this._logger.error(e.stack);
    }

}

module.exports = HighlightUsingRegexCommand;
