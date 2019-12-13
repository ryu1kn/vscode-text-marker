import * as vscode from 'vscode';
import AppIntegrator from './lib/app-integrator';
import {getVsTelemetryReporterCreator} from './lib/telemetry/vscode-telemetry-reporter';
import {join} from 'path';
import WorkspaceAdaptor from './lib/vscode/workspace';
import {TelemetryReporterLocator} from './lib/telemetry/telemetry-reporter-locator';

const workspace = new WorkspaceAdaptor(vscode.workspace);
const reporterCreator = getVsTelemetryReporterCreator(workspace.get<boolean>('enableTelemetry'));
const packageJsonPath = join(__dirname, '..', 'package.json');

TelemetryReporterLocator.load(packageJsonPath, reporterCreator);
const telemetryReporter = TelemetryReporterLocator.getReporter();

exports.activate = (context: vscode.ExtensionContext) => {
    AppIntegrator.create(vscode as any, console).integrate(context);
    context.subscriptions.push(telemetryReporter);

    let config = vscode.workspace.getConfiguration('textmarker')
    // highlight selection
    if (config.enableAutoHighlight) {
        vscode.window.onDidChangeTextEditorSelection((e: vscode.TextEditorSelectionChangeEvent) => {
            if (!vscode.window.activeTextEditor.selection.isEmpty && e.kind == 2) {
                vscode.commands.executeCommand('textmarker.toggleHighlight')
            }
        })
    }

    // update on config change
    vscode.workspace.onDidChangeConfiguration((e: any) => {
        if (e.affectsConfiguration('textmarker')) {
            // do something
        }
    })
};

exports.deactivate = () => {
    telemetryReporter.dispose();
};
