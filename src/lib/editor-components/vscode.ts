import {Position, Range} from 'vscode';
import * as vscode from 'vscode';

export type CreateRange = (p1: Position, p2: Position) => Range;

export type ExtensionContextLike = {
    subscriptions: any[]
};

export interface CommandLike {
    execute(editor?: vscode.TextEditor): Promise<void> | void;
}
