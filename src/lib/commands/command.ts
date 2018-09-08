import {CommandLike} from '../vscode/vscode';
import {Logger} from '../Logger';
import * as vscode from 'vscode';
import TextEditor from '../vscode/text-editor';
import {TelemetryReporter} from '../telemetry/telemetry-reporter';
import {TelemetryReporterLocator} from '../telemetry/telemetry-reporter-locator';

class CommandWrapper {
    private readonly command: CommandLike;
    private readonly logger: Logger;

    constructor(command: CommandLike, logger: Logger) {
        this.command = command;
        this.logger = logger;
    }

    async execute(vsEditor?: vscode.TextEditor) {
        try {
            this.onInvoke();
            const editor = vsEditor && new TextEditor(vsEditor);
            return await this.command.execute(editor);
        } catch (e) {
            this.onError();
            this.logger.error(e.stack);
        }
    }

    protected onInvoke(): void {}
    protected onError(): void {}
}

export class ManualTriggerCommand extends CommandWrapper {
    private readonly name: string;
    private telemetryReporter: TelemetryReporter;

    constructor(name: string, command: CommandLike, logger: Logger) {
        super(command, logger);
        this.name = name;
        this.telemetryReporter = TelemetryReporterLocator.getReporter();
    }

    protected onInvoke(): void {
        this.telemetryReporter.logCommandTrigger(this.name);
    }

    protected onError(): void {
        this.telemetryReporter.logCommandErrored(this.name);
    }
}

export class AutoTriggerCommand extends CommandWrapper {
}
