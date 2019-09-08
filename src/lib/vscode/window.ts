import * as vscode from 'vscode';
import {DecorationRenderOptions, InputBoxOptions, QuickPickOptions, TextEditorDecorationType} from 'vscode';
import TextEditor from './text-editor';
import {fromNullable, fromPredicate, Option} from 'fp-ts/lib/Option';
import {Task} from 'fp-ts/lib/Task';

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

    showInputBox(options: InputBoxOptions): Task<Option<string>> {
        const userInput = new Task(() => this.window.showInputBox(options) as Promise<string>);
        return userInput.map(fromPredicate((s: string) => !!s));
    }

    showInformationMessage(message: string): Thenable<string> {
        return this.window.showInformationMessage(message);
    }

    showQuickPick<T extends QuickPickItem>(selectItems: T[], options: QuickPickOptions): Task<Option<T>> {
        const items = this.fillDescription(selectItems);
        return new Task(() => this.window.showQuickPick(items, options) as Promise<T>).map(fromNullable);
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
