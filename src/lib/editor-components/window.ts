import TextEditorFactory from '../text-editor-factory';

export default class WindowComponent {
    private readonly window: any;
    private readonly textEditorFactory: TextEditorFactory;

    constructor(window, textEditorFactory) {
        this.window = window;
        this.textEditorFactory = textEditorFactory;
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
