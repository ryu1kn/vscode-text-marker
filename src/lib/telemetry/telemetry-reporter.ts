import {Disposable} from 'vscode';
import {VsTelemetryReporterLike} from './vscode-telemetry-reporter';

export class TelemetryReporter implements Disposable {
    private readonly reporter: VsTelemetryReporterLike;

    constructor(reporter: VsTelemetryReporterLike) {
        this.reporter = reporter;
    }

    logCommandTrigger(commandName: string): void {
        this.reporter.sendTelemetryEvent('commandTriggered', {commandName});
    }

    logCommandErrored(commandName: string): void {
        this.reporter.sendTelemetryEvent('commandErrored', {commandName});
    }

    logHighlightUpdated(updateType: string): void {
        this.reporter.sendTelemetryEvent('highlightUpdated', {updateType});
    }

    dispose(): Promise<any> {
        return this.reporter.dispose();
    }
}
