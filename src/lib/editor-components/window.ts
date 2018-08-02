import TextEditorFactory from '../text-editor-factory';
import * as vscode from 'vscode';
import {InputBoxOptions, QuickPickOptions} from 'vscode';

export default class WindowComponent {
    private readonly window: typeof vscode.window;
    private readonly textEditorFactory: TextEditorFactory;

    constructor(window: typeof vscode.window, textEditorFactory: TextEditorFactory) {
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

    showInputBox(options: InputBoxOptions) {
        return this.window.showInputBox(options);
    }

    showInformationMessage(message: string) {
        return this.window.showInformationMessage(message);
    }

    showQuickPick<T extends vscode.QuickPickItem>(selectItems: T[], options: QuickPickOptions) {
        return this.window.showQuickPick<T>(selectItems, options);
    }

}
