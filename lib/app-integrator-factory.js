
const vscode = require('vscode');

const AppIntegrator = require('./app-integrator');
const CommandFactory = require('./command-factory');

class AppIntegratorFactory {

    create() {
        const commandFactory = new CommandFactory({
            vscode,
            logger: console
        });
        return new AppIntegrator({commandFactory, vscode});
    }

}

module.exports = AppIntegratorFactory;
