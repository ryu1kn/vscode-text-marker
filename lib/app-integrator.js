
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
            [`${Const.EXTENSION_NAME}.highlightUsingRegex`, factory.createMarkTextByRegex()],
            [`${Const.EXTENSION_NAME}.clearAllHighlight`, factory.createClearAllHighlightCommand()],
            [`${Const.EXTENSION_NAME}.unhighlight`, factory.createClearHighlightCommand()]
        ]);
        commandMap.forEach((command, commandName) => {
            const disposable = this._vscode.commands.registerCommand(commandName, command.execute, command);
            context.subscriptions.push(disposable);
        });
    }

    _registerTextEditorCommands(context) {
        const command = this._commandFactory.createMarkTextCommand();
        const disposable = this._vscode.commands.registerTextEditorCommand(
                `${Const.EXTENSION_NAME}.markText`, command.execute, command);
        context.subscriptions.push(disposable);
    }

}

module.exports = AppIntegrator;
