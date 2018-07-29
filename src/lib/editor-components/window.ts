
export default class WindowComponent {
    private _window: any;
    private _textEditorFactory: any;

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

    showInputBox(options) {
        return this._window.showInputBox(options);
    }

    showInformationMessage(message) {
        return this._window.showInformationMessage(message);
    }

    showQuickPick(selectItems, options) {
        return this._window.showQuickPick(selectItems, options);
    }

}
