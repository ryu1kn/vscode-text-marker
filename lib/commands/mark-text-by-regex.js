
class MarkTextByRegexCommand {

    constructor(params) {
        this._vsWindow = params.vsWindow;
        this._logger = params.logger;
        this._decorationOperatorFactory = params.decorationOperatorFactory;
        this._regexReader = params.regexReader;
    }

    execute() {
        return Promise.resolve()
            .then(() => this._regexReader.read())
            .then(regex => {
                if (!regex) return;

                const visibleEditors = this._vsWindow.visibleTextEditors;
                const decorationOperator = this._decorationOperatorFactory.create(visibleEditors);
                decorationOperator.addDecoration(regex);
            })
            .catch(e => this._handleError(e));
    }

    _handleError(e) {
        this._logger.error(e.stack);
    }

}

module.exports = MarkTextByRegexCommand;
