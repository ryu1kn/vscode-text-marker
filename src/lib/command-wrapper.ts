import {CommandLike} from './editor-components/vscode';
import {Logger} from './Logger';
import * as vscode from 'vscode';

export default class CommandWrapper {
    private readonly command: CommandLike;
    private readonly logger: Logger;

    constructor(command: CommandLike, logger: Logger) {
        this.command = command;
        this.logger = logger;
    }

    async execute(editor?: vscode.TextEditor) {
        try {
            return await this.command.execute(editor);
        } catch (e) {
            this.logger.error(e.stack);
        }
    }

}
