import {Position, Range} from 'vscode';
import TextEditor from '../text-editor';

export type CreateRange = (p1: Position, p2: Position) => Range;

export type ExtensionContextLike = {
    subscriptions: any[]
};

export interface CommandLike {
    execute(editor?: TextEditor): Promise<void> | void;
}
