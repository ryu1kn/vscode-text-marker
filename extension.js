const vscode = require('vscode');
const AppIntegrator = require('./lib/app-integrator');

exports.activate = context => {
    AppIntegrator.create(vscode, console).integrate(context);
};

exports.deactivate = () => {};
