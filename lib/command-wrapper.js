
class CommandWrapper {

    constructor({command, logger}) {
        this._command = command;
        this._logger = logger;
    }

    execute(...args) {
        return Promise.resolve()
            .then(() => this._command.execute(...args))
            .catch(e => this._handleError(e));
    }

    _handleError(e) {
        this._logger.error(e.stack);
    }

}

module.exports = CommandWrapper;
