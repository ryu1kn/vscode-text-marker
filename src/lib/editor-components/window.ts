import * as vscode from 'vscode';
import {InputBoxOptions, QuickPickOptions} from 'vscode';
import TextEditor from '../text-editor';

export default class WindowComponent {
    private readonly window: typeof vscode.window;

    constructor(window: typeof vscode.window) {
        this.window = window;
    }

    get visibleTextEditors() {
        return this.window.visibleTextEditors
            .map(editor => new TextEditor(editor));
    }

    get activeTextEditor() {
        return new TextEditor(this.window.activeTextEditor);
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
