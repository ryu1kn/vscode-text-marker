
class WindowComponent {

    constructor(params) {
        this._window = params.window;
        this._textEditorFactory = params.textEditorFactory;
    }

    get visibleTextEditors() {
        return this._window.visibleTextEditors
            .map(editor => this._textEditorFactory.create(editor));
    }

    get activeTextEditor() {
        return this._textEditorFactory.create(this._window.activeTextEditor);
    }

}

module.exports = WindowComponent;
