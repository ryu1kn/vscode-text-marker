
class WindowComponent {

    constructor(params) {
        this._window = params.window;
        this._textEditorFactory = params.textEditorFactory;
    }

    get visibleTextEditors() {
        return this._window.visibleTextEditors
            .map(editor => this._textEditorFactory.create(editor));
    }

}

module.exports = WindowComponent;
