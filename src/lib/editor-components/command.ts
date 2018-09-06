import * as vscode from 'vscode';
import {Disposable} from 'vscode';
import {CommandLike} from './vscode';
import CommandWrapper from '../command-wrapper';
import {Logger} from '../Logger';

export type CommandType = 'GENERAL' | 'TEXT_EDITOR';

export interface CommandItem {
    name: string;
    command: CommandLike;
    type: CommandType;
}

export default class CommandComponent {
    private readonly commands: typeof vscode.commands;
    private readonly logger: Logger;

    constructor(commands: typeof vscode.commands,
                logger: Logger) {
        this.commands = commands;
        this.logger = logger;
    }

    registerCommand(item: CommandItem): Disposable {
        const registerer = this.getCommandRegisterer(item.type);
        const commandWrapper = new CommandWrapper(item.command, this.logger);
        return registerer(item.name, commandWrapper.execute, commandWrapper);
    }

    private getCommandRegisterer(type: CommandType) {
        return type === 'GENERAL' ?
            this.commands.registerCommand :
            this.commands.registerTextEditorCommand;
    }
}
