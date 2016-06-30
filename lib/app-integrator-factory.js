
'use strict';

const vscode = require('vscode');

const AppIntegrator = require('./app-integrator');
const AppFactory = require('./app-factory');

class AppIntegratorFactory {
    create() {
        const app = new AppFactory().create(vscode, console);
        return new AppIntegrator({app, vscode});
    }
}

module.exports = AppIntegratorFactory;
