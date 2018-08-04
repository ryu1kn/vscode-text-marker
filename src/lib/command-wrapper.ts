import {CommandLike} from './editor-components/vscode';
import {Logger} from './Logger';
import * as vscode from 'vscode';
import TextEditorFactory from './text-editor-factory';

export default class CommandWrapper {
    private readonly command: CommandLike;
    private readonly textEditorFactory: TextEditorFactory;
    private readonly logger: Logger;

    constructor(command: CommandLike, textEditorFactory: TextEditorFactory, logger: Logger) {
        this.command = command;
        this.textEditorFactory = textEditorFactory;
        this.logger = logger;
    }

    async execute(vsEditor?: vscode.TextEditor) {
        try {
            const editor = vsEditor && this.textEditorFactory.create(vsEditor);
            return await this.command.execute(editor);
        } catch (e) {
            this.logger.error(e.stack);
        }
    }

}
