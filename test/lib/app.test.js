
const App = require('../../lib/app');

// TODO: Too much fake object setup, decompose implementation

suite('App', () => {

    suite('#markText', () => {

        test('it highlights all the strings equal to the selected string', () => {
            const editor = fakeEditor('SELECTED', 'STR1 SELECTED STR2 SELECTED');
            const vscode = fakeVscode(editor);
            const logger = getLogger();
            const decorationRegistry = {
                inquire: () => null,
                issue: stubWithArgs(['SELECTED'], 'DECORATION_TYPE')
            };
            const textLocator = {locate: () => ['RANGE_1', 'RANGE_2']};
            new App({decorationRegistry, textLocator, vscode, logger}).markText(editor);

            expect(vscode.window.visibleTextEditors[0].setDecorations)
                .to.have.been.calledWith('DECORATION_TYPE', ['RANGE_1', 'RANGE_2']);
        });

        test('Selecting already selected text is de-highlights the selected strings', () => {
            const editor = fakeEditor('SELECTED', 'STR1 SELECTED STR2 SELECTED');
            const vscode = fakeVscode(editor);
            const logger = getLogger();
            const decorationRegistry = {
                inquire: stubWithArgs(['SELECTED'], 'DECORATION_TYPE')
            };
            new App({decorationRegistry, vscode, logger}).markText(editor);

            expect(vscode.window.visibleTextEditors[0].setDecorations)
                .to.have.been.calledWith('DECORATION_TYPE', []);
        });
    });

    function fakeEditor(selectedText, entireText) {
        return {
            selection: {text: selectedText},
            document: {
                getText: selection => selection ? selection.text : entireText
            },
            setDecorations: sinon.spy()
        };
    }

    function fakeVscode(editor) {
        return {window: {visibleTextEditors: [editor]}};
    }

    function getLogger() {
        return console;
    }
});
