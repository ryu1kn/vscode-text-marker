
class MarkTextByRegexCommand {

    constructor(params) {
        this._vsWindow = params.vsWindow;
        this._logger = params.logger;
        this._decorationOperatorFactory = params.decorationOperatorFactory;
    }

    execute() {
        // To be implemented
    }

    _handleError(e) {
        this._logger.error(e.stack);
    }

}

module.exports = MarkTextByRegexCommand;
