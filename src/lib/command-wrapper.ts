import {CommandLike} from './editor-components/vscode';
import {Logger} from './Logger';

export default class CommandWrapper {
    private readonly command: CommandLike;
    private readonly logger: Logger;

    constructor(command: CommandLike, logger: Logger) {
        this.command = command;
        this.logger = logger;
    }

    async execute(...args: any[]) {
        try {
            return await this.command.execute(...args);
        } catch (e) {
            this.logger.error(e.stack);
        }
    }

}
