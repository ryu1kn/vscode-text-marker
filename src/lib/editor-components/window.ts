
export default class WindowComponent {
    private readonly window: any;
    private readonly textEditorFactory: any;

    constructor(params) {
        this.window = params.window;
        this.textEditorFactory = params.textEditorFactory;
    }

    get visibleTextEditors() {
        return this.window.visibleTextEditors
            .map(editor => this.textEditorFactory.create(editor));
    }

    get activeTextEditor() {
        return this.textEditorFactory.create(this.window.activeTextEditor);
    }

    showInputBox(options) {
        return this.window.showInputBox(options);
    }

    showInformationMessage(message) {
        return this.window.showInformationMessage(message);
    }

    showQuickPick(selectItems, options) {
        return this.window.showQuickPick(selectItems, options);
    }

}
