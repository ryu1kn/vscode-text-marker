
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
            [`${Const.EXTENSION_NAME}.highlightUsingRegex`, factory.createHighlightUsingRegex()],
            [`${Const.EXTENSION_NAME}.clearAllHighlight`, factory.createRemoveAllHighlightsCommand()],
            [`${Const.EXTENSION_NAME}.toggleCaseSensitivity`, factory.createToggleCaseSensitivityCommand()],
            [`${Const.EXTENSION_NAME}.unhighlight`, factory.createUnhighlightCommand()]
        ]);
        commandMap.forEach((command, commandName) => {
            const disposable = this._vscode.commands.registerCommand(commandName, command.execute, command);
            context.subscriptions.push(disposable);
        });
    }

    _registerTextEditorCommands(context) {
        const factory = this._commandFactory;
        const commandMap = new Map([
            [`${Const.EXTENSION_NAME}.markText`, factory.createToggleHighlightCommand()],
            [`${Const.EXTENSION_NAME}.highlight`, factory.createHighlightCommand()]
        ]);
        commandMap.forEach((command, commandName) => {
            const disposable = this._vscode.commands.registerTextEditorCommand(commandName, command.execute, command);
            context.subscriptions.push(disposable);
        });
    }

}

module.exports = AppIntegrator;
