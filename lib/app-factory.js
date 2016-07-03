
'use strict';

const App = require('./app');
const ColourRegistry = require('./colour-registry');
const ConfigStore = require('./config-store');
const DecorationRegistry = require('./decoration-registry');
const TextDecorator = require('./text-decorator');
const TextLocator = require('./text-locator');
const Throttle = require('./throttle');

class AppFactory {
    create(vscode, logger) {
        const configStore = new ConfigStore({workspace: vscode.workspace});
        const colourRegistry = new ColourRegistry({configStore});
        const decorationRegistry = new DecorationRegistry({colourRegistry, window: vscode.window});
        const textLocator = new TextLocator({Range: vscode.Range});
        const textDecorator = new TextDecorator({textLocator});
        const throttle = new Throttle({configStore});
        return new App({decorationRegistry, logger, textDecorator, throttle, vscode});
    }
}

module.exports = AppFactory;
