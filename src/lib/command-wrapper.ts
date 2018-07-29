
export default class CommandWrapper {
    private readonly _command: any;
    private readonly _logger: any;

    constructor({command, logger}) {
        this._command = command;
        this._logger = logger;
    }

    async execute(...args) {
        try {
            return await this._command.execute(...args);
        } catch (e) {
            this._logger.error(e.stack);
        }
    }

}
