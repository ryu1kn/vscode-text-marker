import * as vscode from 'vscode';
import {DecorationRenderOptions, InputBoxOptions, QuickPickOptions, TextEditorDecorationType} from 'vscode';
import TextEditor from './text-editor';
import {fromNullable, fromPredicate, Option} from 'fp-ts/lib/Option';

type QuickPickItemWithoutDescription = Pick<vscode.QuickPickItem, Exclude<keyof vscode.QuickPickItem, 'description'>>;

export interface QuickPickItem extends QuickPickItemWithoutDescription {
    description?: string;
}

export default class WindowComponent {
    private readonly window: typeof vscode.window;

    constructor(window: typeof vscode.window) {
        this.window = window;
    }

    get visibleTextEditors(): TextEditor[] {
        return this.window.visibleTextEditors
            .map(editor => new TextEditor(editor));
    }

    get activeTextEditor(): TextEditor | undefined {
        const editor = this.window.activeTextEditor;
        return editor && new TextEditor(editor);
    }

    async showInputBox(options: InputBoxOptions): Promise<Option<string>> {
        const userInput = await this.window.showInputBox(options);
        return fromPredicate((s: string) => !!s)(userInput);
    }

    showInformationMessage(message: string): Thenable<string> {
        return this.window.showInformationMessage(message);
    }

    async showQuickPick<T extends QuickPickItem>(selectItems: T[], options: QuickPickOptions): Promise<Option<T>> {
        const items = this.fillDescription(selectItems);
        const result = await this.window.showQuickPick(items, options);
        return fromNullable(result);
    }

    createTextEditorDecorationType(options: DecorationRenderOptions): TextEditorDecorationType {
        return this.window.createTextEditorDecorationType(options);
    }

    private fillDescription<T extends QuickPickItem>(selectItems: T[]) {
        return selectItems.map(item =>
            Object.assign({}, item, {description: item.description || ''})
        );
    }
}
