import {Position, Range} from 'vscode';

export type CreateRange = (p1: Position, p2: Position) => Range;

export type ExtensionContextLike = {
    subscriptions: any[]
};

export type CommandLike = {execute(editor?: any): Promise<void> | void};
