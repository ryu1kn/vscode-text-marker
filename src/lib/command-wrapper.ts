
export default class CommandWrapper {
    private readonly command: any;
    private readonly logger: any;

    constructor({command, logger}) {
        this.command = command;
        this.logger = logger;
    }

    async execute(...args) {
        try {
            return await this.command.execute(...args);
        } catch (e) {
            this.logger.error(e.stack);
        }
    }

}
