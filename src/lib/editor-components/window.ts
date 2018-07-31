import TextEditorFactory from '../text-editor-factory';
import * as vscode from 'vscode';

export default class WindowComponent {
    private readonly window: typeof vscode.window;
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

    showQuickPick<T extends vscode.QuickPickItem>(selectItems, options) {
        return this.window.showQuickPick<T>(selectItems, options);
    }

}
