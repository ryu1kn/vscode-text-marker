import {stubReturns} from '../../helpers/helper';
import {Range} from 'vscode';

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
    const decorationTypes = '123456789'.split('').map(digit => `DECORATION_TYPE_${digit}`);
    return stubReturns(...decorationTypes);
}

export const EXECUTION_CONTEXT = {subscriptions: []};
