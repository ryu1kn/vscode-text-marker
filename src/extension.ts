import * as vscode from 'vscode';
import AppIntegrator from './lib/app-integrator';

exports.activate = (context: vscode.ExtensionContext) => {
    AppIntegrator.create(vscode as any, console).integrate(context);
};

exports.deactivate = () => {};
