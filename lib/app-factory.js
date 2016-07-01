
'use strict';

const App = require('./app');
const DecorationRegistry = require('./decoration-registry');
const TextLocator = require('./text-locator');

class AppFactory {

    create(vscode, logger) {
        const decorationRegistry = new DecorationRegistry({window: vscode.window});
        const textLocator = new TextLocator({Range: vscode.Range});
        return new App({decorationRegistry, logger, textLocator, vscode});
    }

}

module.exports = AppFactory;
