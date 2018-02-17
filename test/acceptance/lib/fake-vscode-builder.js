
class FakeVscodeBuilder {

    build(params) {
        const commands = {};
        const textMarkerConfig = {
            highlightColors: ['COLOUR_A', 'COLOUR_B'],
            savedHighlights: []
        };
        return {
            Range: function (startPos, endPos) {
                this._startPos = startPos;
                this._endPos = endPos;
            },
            window: {
                onDidChangeActiveTextEditor: () => {},
                createStatusBarItem: () => ({show: () => {}}),
                createTextEditorDecorationType: this._createTextEditorDecorationTypeStub,
                visibleTextEditors: params.editors
            },
            workspace: {
                onDidChangeTextDocument: () => {},
                getConfiguration: configKey =>
                    configKey === 'textmarker' ?
                        {get: textMarkerConfigKey => textMarkerConfig[textMarkerConfigKey]} :
                        {}
            },
            commands: {
                registerCommand: () => {},
                registerTextEditorCommand: (commandName, handler, scope) => {
                    commands[commandName] = handler.bind(scope);
                }
            },
            StatusBarAlignment: {Right: 2},
            _commands: commands
        };
    }

    get _createTextEditorDecorationTypeStub() {
        const decorationTypes = '123456789'.split('').map(digit => `DECORATION_TYPE_${digit}`);
        return stubReturns(...decorationTypes);
    }

}

module.exports = FakeVscodeBuilder;
