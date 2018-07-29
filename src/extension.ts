import * as vscode from 'vscode';
import AppIntegrator from './lib/app-integrator';

exports.activate = context => {
    AppIntegrator.create(vscode, console).integrate(context);
};

exports.deactivate = () => {};
