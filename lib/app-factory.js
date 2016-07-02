
'use strict';

const App = require('./app');
const ColourStore = require('./colour-registry');
const DecorationRegistry = require('./decoration-registry');
const TextDecorator = require('./text-decorator');
const TextLocator = require('./text-locator');
const Throttle = require('./throttle');

class AppFactory {

    create(vscode, logger) {
        const colourRegistry = new ColourStore({workspace: vscode.workspace});
        const decorationRegistry = new DecorationRegistry({colourRegistry, window: vscode.window});
        const textLocator = new TextLocator({Range: vscode.Range});
        const textDecorator = new TextDecorator({textLocator});
        const throttle = new Throttle({delayMsec: 1000});
        return new App({decorationRegistry, logger, textDecorator, throttle, vscode});
    }

}

module.exports = AppFactory;
