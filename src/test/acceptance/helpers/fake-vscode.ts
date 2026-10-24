import {stubReturns} from '../../helpers/mock';
import {Range} from 'vscode';

export const decorationTypes = '123456789'.split('').map(digit => ({key: `DECORATION_TYPE_${digit}`, dispose() {}}));

export const createFakeVsCode = ({editors}: any = {}) => {
    const commands = {} as any;
    const textMarkerConfig = {
        highlightColors: ['COLOUR_A', 'COLOUR_B'],
        savedHighlights: [] as any[]
    } as any;
    return {
        _startPos: undefined,
        _endPos: undefined,
        Range,
        window: {
            onDidChangeActiveTextEditor: () => {},
            createStatusBarItem: () => ({show: () => {}}),
            createTextEditorDecorationType: createTextEditorDecorationTypeStub(),
            visibleTextEditors: editors
        },
        workspace: {
            onDidChangeTextDocument: () => {},
            onDidChangeConfiguration: () => {},
            getConfiguration: (configKey: string) =>
                configKey === 'textmarker' ?
                    {get: (textMarkerConfigKey: string) => textMarkerConfig[textMarkerConfigKey]} :
                    {}
        },
        commands: {
            registerCommand: () => {},
            registerTextEditorCommand: (commandName: string, handler: any, scope: any) => {
                commands[commandName] = handler.bind(scope);
            }
        },
        StatusBarAlignment: {Right: 2},
        _commands: commands
    };
};

function createTextEditorDecorationTypeStub() {
    return stubReturns(...decorationTypes);
}

export const EXECUTION_CONTEXT = {subscriptions: []};
