import {Range} from 'vscode';

export type CreateRange = (p1: any, p2: any) => Range;

export type ExtensionContextLike = {
    subscriptions: any[]
};

export type CommandLike = {execute(editor?: any): Promise<void> | void};
