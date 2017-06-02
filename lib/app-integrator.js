
const Const = require('./const');

class AppIntegrator {

    constructor(params) {
        this._commandFactory = params.commandFactory;
        this._vscode = params.vscode;
    }

    integrate(context) {
        this._registerCommands(context);
        this._registerTextEditorCommands(context);
        this._registerEventListeners(context);
        this._prepareStatusBarItems();
        this._broadcastReady();
    }

    _registerEventListeners(context) {
        const decorationRefresher = this._commandFactory.createDecorationRefresher();
        this._vscode.window.onDidChangeActiveTextEditor(
                decorationRefresher.refresh, decorationRefresher, context.subscriptions);
        this._vscode.workspace.onDidChangeTextDocument(
                decorationRefresher.refreshWithDelay, decorationRefresher, context.subscriptions);
    }

    _registerCommands(context) {
        const factory = this._commandFactory;
        const commandMap = new Map([
            [`${Const.EXTENSION_ID}.highlightUsingRegex`, factory.createHighlightUsingRegex()],
            [`${Const.EXTENSION_ID}.clearAllHighlight`, factory.createRemoveAllHighlightsCommand()],
            [`${Const.EXTENSION_ID}.toggleCaseSensitivity`, factory.createToggleCaseSensitivityCommand()],
            [`${Const.EXTENSION_ID}.toggleCaseSensitivityMode`, factory.createToggleCaseSensitivityModeCommand()],
            [`${Const.EXTENSION_ID}.unhighlight`, factory.createUnhighlightCommand()]
        ]);
        commandMap.forEach((command, commandName) => {
            const disposable = this._vscode.commands.registerCommand(commandName, command.execute, command);
            context.subscriptions.push(disposable);
        });
    }

    _registerTextEditorCommands(context) {
        const factory = this._commandFactory;
        const commandMap = new Map([
            [`${Const.EXTENSION_ID}.markText`, factory.createToggleHighlightCommand()],
            [`${Const.EXTENSION_ID}.highlight`, factory.createHighlightCommand()]
        ]);
        commandMap.forEach((command, commandName) => {
            const disposable = this._vscode.commands.registerTextEditorCommand(commandName, command.execute, command);
            context.subscriptions.push(disposable);
        });
    }

    _prepareStatusBarItems() {
        this._commandFactory.createToggleCaseSensitivityModeButton();
    }

    _broadcastReady() {
        this._commandFactory.getEventBus().emit('TEXT_MARKER_READY');
    }

}

module.exports = AppIntegrator;
