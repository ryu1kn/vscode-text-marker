// HACK: As vscode is not available if tests are not running on VSCode's extensionHostProcess,
//       return mock vscode module when `require`d

import {Position, Range, Selection} from 'vscode';

const mockVscode = {
    OverviewRulerLane: {Center: 2},
    StatusBarAlignment: {Right: 2},
    TextEditorRevealType: {InCenterIfOutsideViewport: 2},
    Position: function (line: number, character: number) {
        return {line, character};
    },
    Selection: function (start: Position, end: Position) {
        return {start, end} as Selection;
    },
    Range: function (start: Position, end: Position) {
        return {start, end} as Range;
    }
};

const moduleProto = Object.getPrototypeOf(module);

moduleProto.require = new Proxy(moduleProto.require, {
    apply: (require, that, args) =>
        args[0] === 'vscode' ? mockVscode : Reflect.apply(require, that, args)
});
