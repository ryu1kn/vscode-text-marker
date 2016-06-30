
'use strict';

const EXTENSION_NAMESPACE = 'textmarker';

class AppIntegrator {
    constructor(params) {
        this._app = params.app;
        this._vscode = params.vscode;
    }

    integrate(context) {
        this._registerTextEditorCommands(context);
    }

    _registerTextEditorCommands(context) {
        const app = this._app;
        const disposable = this._vscode.commands.registerTextEditorCommand(
                `${EXTENSION_NAMESPACE}.markText`, app.markText.bind(app));
        context.subscriptions.push(disposable);
    }
}

module.exports = AppIntegrator;
