
'use strict';

const App = require('./app');
const ColourRegistry = require('./colour-registry');
const ConfigStore = require('./config-store');
const Debouncer = require('./debouncer');
const DecorationOperatorFactory = require('./decoration-operator-factory');
const DecorationRegistry = require('./decoration-registry');
const SelectedTextFinder = require('./selected-text-finder');
const TextDecorator = require('./text-decorator');
const TextLocator = require('./text-locator');

class AppFactory {

    create(vscode, logger) {
        const configStore = new ConfigStore({workspace: vscode.workspace});
        const colourRegistry = new ColourRegistry({configStore});
        const decorationRegistry = new DecorationRegistry({
            colourRegistry,
            window: vscode.window
        });
        const textLocator = new TextLocator({Range: vscode.Range});
        const textDecorator = new TextDecorator({textLocator});
        return new App({
            debouncer: new Debouncer({configStore}),
            decorationOperatorFactory: new DecorationOperatorFactory({textDecorator, decorationRegistry}),
            logger,
            selectedTextFinder: new SelectedTextFinder(),
            vsWindow: vscode.window
        });
    }

}

module.exports = AppFactory;
