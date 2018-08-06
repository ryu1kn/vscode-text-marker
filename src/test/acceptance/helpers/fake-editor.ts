import {mockMethods} from '../../helpers/mock';
import * as vscode from 'vscode';
import {Position, Selection} from 'vscode';

export const createFakeEditor = ({selectedText, wholeText}: any = {}) => {
    return mockMethods<vscode.TextEditor>(['setDecorations'], {
        document: {
            getText: (selection: any) => selection ? selectedText : wholeText,
            positionAt: (offset: number) => new Position(0, offset),
            offsetAt: (p: Position) => p.character,
            uri: 'EDITOR_ID'
        },
        selection: createSelection(selectedText, wholeText)
    });
};

function createSelection(selectedText: any, wholeText: any) {
    if (!selectedText) return null;
    return new Selection(
        new Position(0, wholeText.indexOf(selectedText)),
        new Position(0, wholeText.indexOf(selectedText) + selectedText.length)
    );
}
