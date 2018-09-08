import * as vscode from 'vscode';
import {InputBoxOptions, QuickPickOptions} from 'vscode';
import TextEditor from '../text-editor';
import {fromPredicate, Option} from 'fp-ts/lib/Option';

type QuickPickItemWithoutDescription = Pick<vscode.QuickPickItem, Exclude<keyof vscode.QuickPickItem, 'description'>>;

export interface QuickPickItem extends QuickPickItemWithoutDescription {
    description?: string;
}

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

    async showInputBox(options: InputBoxOptions): Promise<Option<string>> {
        const userInput = await this.window.showInputBox(options);
        return fromPredicate((s: string) => !!s)(userInput);
    }

    showInformationMessage(message: string) {
        return this.window.showInformationMessage(message);
    }

    showQuickPick<T extends QuickPickItem>(selectItems: T[], options: QuickPickOptions) {
        const items = this.fillDescription(selectItems);
        return this.window.showQuickPick(items, options);
    }

    private fillDescription<T extends QuickPickItem>(selectItems: T[]) {
        return selectItems.map(item =>
            Object.assign({}, item, {description: item.description || ''})
        );
    }
}
