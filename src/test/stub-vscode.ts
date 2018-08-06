// HACK: As vscode is not available if tests are not running on VSCode's extensionHostProcess,
//       return mock vscode module when `require`d

import {Position, Selection} from 'vscode';

const mockVscode = {
    OverviewRulerLane: {Center: 2},
    StatusBarAlignment: {Right: 2},
    TextEditorRevealType: {InCenterIfOutsideViewport: 2},
    Selection: function (p1: Position, p2: Position) {
        return {start: p1, end: p2} as Selection;
    }
};

const moduleProto = Object.getPrototypeOf(module);

moduleProto.require = new Proxy(moduleProto.require, {
    apply: (require, that, args) =>
        args[0] === 'vscode' ? mockVscode : Reflect.apply(require, that, args)
});
