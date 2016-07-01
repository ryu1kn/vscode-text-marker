
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
                inquire: stubWithArgs(['SELECTED'], 'DECORATION_TYPE'),
                revoke: sinon.spy()
            };
            new App({decorationRegistry, vscode, logger}).markText(editor);

            expect(decorationRegistry.revoke).to.have.been.calledWith('SELECTED');
            expect(vscode.window.visibleTextEditors[0].setDecorations)
                .to.have.been.calledWith('DECORATION_TYPE', []);
        });

        test('it logs error if an exception occurred', () => {
            const logger = {error: sinon.spy()};
            const editor = {
                document: {
                    getText: () => {throw new Error('GET_TEXT_ERROR');}
                }
            };
            new App({logger}).markText(editor);
            expect(logger.error.args[0][0]).to.have.string('Error: GET_TEXT_ERROR');
        });
    });

    suite('#refreshDecorations', () => {

        test('it sets all currently active decorations to visible the given editor', () => {
            const editor = fakeEditor('SELECTED', 'STR1 SELECTED STR2 SELECTED');
            const logger = getLogger();
            const decorationRegistry = {
                retrieveAll: () => ({TEXT_1: 'DECORATION_TYPE_1', TEXT_2: 'DECORATION_TYPE_2'})
            };
            const textLocator = {
                locate: (editor, text) => {
                    switch (text) { // eslint-disable-line default-case
                    case 'TEXT_1': return ['RANGE_1_1', 'RANGE_1_2'];
                    case 'TEXT_2': return ['RANGE_2'];
                    }
                }
            };
            new App({decorationRegistry, textLocator, logger}).refreshDecorations(editor);

            expect(editor.setDecorations.args).to.eql([
                ['DECORATION_TYPE_1', ['RANGE_1_1', 'RANGE_1_2']],
                ['DECORATION_TYPE_2', ['RANGE_2']]
            ]);
        });

        test('it does nothing if editor is not given when invoked', () => {
            const logger = {error: sinon.spy()};
            const decorationRegistry = {retrieveAll: sinon.spy()};
            new App({decorationRegistry, logger}).refreshDecorations();
            expect(decorationRegistry.retrieveAll).to.have.been.not.called;
        });

        test('it logs error if an exception occurred', () => {
            const logger = {error: sinon.spy()};
            const decorationRegistry = {
                retrieveAll: () => {throw new Error('RETRIEVE_ALL_ERROR');}
            };
            new App({decorationRegistry, logger}).refreshDecorations('EDITOR');
            expect(logger.error.args[0][0]).to.have.string('Error: RETRIEVE_ALL_ERROR');
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
