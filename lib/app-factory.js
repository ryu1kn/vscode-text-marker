
'use strict';

const App = require('./app');
const ColourRegistry = require('./colour-registry');
const ConfigStore = require('./config-store');
const DecorationOperatorFactory = require('./decoration-operator-factory');
const DecorationRegistry = require('./decoration-registry');
const TextDecorator = require('./text-decorator');
const TextLocator = require('./text-locator');
const Debouncer = require('./debouncer');

class AppFactory {

    create(vscode, logger) {
        const configStore = new ConfigStore({workspace: vscode.workspace});
        const colourRegistry = new ColourRegistry({configStore});
        const decorationRegistry = new DecorationRegistry({colourRegistry, window: vscode.window});
        const textLocator = new TextLocator({Range: vscode.Range});
        const textDecorator = new TextDecorator({textLocator});
        const decorationOperatorFactory = new DecorationOperatorFactory({textDecorator, decorationRegistry});
        const debouncer = new Debouncer({configStore});
        return new App({
            decorationOperatorFactory,
            decorationRegistry,
            logger,
            textDecorator,
            debouncer,
            vscode
        });
    }

}

module.exports = AppFactory;
