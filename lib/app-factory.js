
'use strict';

const App = require('./app');
const DecorationRegistry = require('./decoration-registry');
const TextLocator = require('./text-locator');
const Throttle = require('./throttle');

class AppFactory {

    create(vscode, logger) {
        const decorationRegistry = new DecorationRegistry({window: vscode.window});
        const textLocator = new TextLocator({Range: vscode.Range});
        const throttle = new Throttle({delayMsec: 1000});
        return new App({decorationRegistry, logger, textLocator, throttle, vscode});
    }

}

module.exports = AppFactory;
