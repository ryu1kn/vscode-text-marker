import * as vscode from 'vscode';
import AppIntegrator from './lib/app-integrator';
import {getVsTelemetryReporterCreator} from './lib/telemetry/vscode-telemetry-reporter';
import {join} from 'path';
import WorkspaceAdaptor from './lib/vscode/workspace';
import {TelemetryReporterLocator} from './lib/telemetry/telemetry-reporter-locator';
const debounce = require('lodash.debounce')

const workspace = new WorkspaceAdaptor(vscode.workspace);
const reporterCreator = getVsTelemetryReporterCreator(workspace.get<boolean>('enableTelemetry'));
const packageJsonPath = join(__dirname, '..', 'package.json');

TelemetryReporterLocator.load(packageJsonPath, reporterCreator);
const telemetryReporter = TelemetryReporterLocator.getReporter();

exports.activate = (context: vscode.ExtensionContext) => {
    AppIntegrator.create(vscode as any, console).integrate(context);
    context.subscriptions.push(telemetryReporter);

    // highlight selection
    if (vscode.workspace.getConfiguration('textmarker.enableAutoHighlight')) {
        vscode.window.onDidChangeTextEditorSelection(
            debounce(function (e: vscode.TextEditorSelectionChangeEvent) {
                vscode.commands.executeCommand('textmarker.clearAllHighlight')
                
                setTimeout(() => {
                    vscode.commands.executeCommand('textmarker.toggleHighlight')
                }, 100);
            }, 150)
        )
    }
};

exports.deactivate = () => {
    telemetryReporter.dispose();
};
