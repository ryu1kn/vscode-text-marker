
export default class CommandWrapper {
    private readonly command: {execute(editor?): Promise<void> | void};
    private readonly logger: {error(...args: string[]): void};

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
