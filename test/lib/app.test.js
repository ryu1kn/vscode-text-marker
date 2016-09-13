
const App = require('../../lib/app');

// TODO: Too much fake object setup, decompose implementation

suite('App', () => {

    suite('#markText', () => {

        test('it toggles the decoration of selected text', () => {
            const editor = fakeEditor('SELECTED', 'STR1 SELECTED STR2 SELECTED');
            const vscode = fakeVscode(editor);
            const logger = getLogger();
            const decorationOperator = {toggleDecoration: sinon.spy()};
            const decorationOperatorFactory = {create: sinon.stub().returns(decorationOperator)};
            new App({decorationOperatorFactory, vscode, logger}).markText(editor);

            expect(decorationOperatorFactory.create).to.have.been.calledWith([editor]);
            expect(decorationOperator.toggleDecoration).to.have.been.calledWith('SELECTED');
        });

        test('it does nothing if text is not selected', () => {
            const editor = fakeEditor('', 'ENTIRE TEXT');
            const decorationOperatorFactory = {create: sinon.spy()};
            new App({decorationOperatorFactory}).markText(editor);
            expect(decorationOperatorFactory.create).to.have.been.not.called;
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

    suite('#clearAllHighlight', () => {

        test('it highlights all the strings equal to the selected string', () => {
            const vscode = {
                window: {visibleTextEditors: ['EDITOR_1', 'EDITOR_2']}
            };
            const logger = getLogger();
            const decorationRegistry = {
                revoke: sinon.spy(),
                retrieveAll: () => ({
                    text1: 'DECORATION_TYPE_1',
                    text2: 'DECORATION_TYPE_2'
                })
            };
            const textDecorator = {undecorate: sinon.spy()};
            new App({decorationRegistry, textDecorator, vscode, logger}).clearAllHighlight();

            expect(decorationRegistry.revoke.args).to.eql([['text1'], ['text2']]);
            expect(textDecorator.undecorate).to.have.been.calledWith(
                ['EDITOR_1', 'EDITOR_2'],
                ['DECORATION_TYPE_1', 'DECORATION_TYPE_2']
            );
        });
    });

    suite('#refreshDecorations', () => {

        test('it lets DecorationOperator to refresh decorations', () => {
            const editor = fakeEditor('SELECTED', 'STR1 SELECTED STR2 SELECTED');
            const vscode = fakeVscode(editor);
            const logger = getLogger();
            const decorationOperator = {refreshDecoration: sinon.spy()};
            const decorationOperatorFactory = {create: sinon.stub().returns(decorationOperator)};
            new App({decorationOperatorFactory, vscode, logger}).refreshDecorations(editor);

            expect(decorationOperatorFactory.create).to.have.been.calledWith([editor]);
            expect(decorationOperator.refreshDecoration).to.have.been.calledWith();
        });

        test('it does nothing if editor is not given when invoked', () => {
            const editor = undefined;
            const logger = {error: sinon.spy()};
            const decorationOperatorFactory = {create: sinon.spy()};
            new App({decorationOperatorFactory, logger}).refreshDecorations(editor);
            expect(decorationOperatorFactory.create).to.have.been.not.called;
        });

        test('it logs error if an exception occurred', () => {
            const logger = {error: sinon.spy()};
            const decorationOperatorFactory = {
                create: () => {throw new Error('CREATE_ERROR');}
            };
            new App({decorationOperatorFactory, logger}).refreshDecorations('EDITOR');
            expect(logger.error.args[0][0]).to.have.string('Error: CREATE_ERROR');
        });
    });

    suite('#refreshDecorationsWithDelay', () => {

        test('it refreshes text markups but debounce the execution', () => {
            const editor = 'EDITOR';
            const vscode = fakeVscode(editor);
            const logger = getLogger();
            const decorationOperator = {refreshDecoration: sinon.spy()};
            const decorationOperatorFactory = {create: sinon.stub().returns(decorationOperator)};
            const debouncer = {debounce: sinon.stub().callsArg(0)};
            const app = new App({debouncer, decorationOperatorFactory, logger, vscode});

            app.refreshDecorationsWithDelay('DOCUMENT_CHANGE_EVENT');

            expect(decorationOperatorFactory.create).to.have.been.calledWith([editor]);
            expect(decorationOperator.refreshDecoration).to.have.been.calledWith();
        });

        test('it does nothing if editor is not given when invoked', () => {
            const editor = undefined;
            const vscode = fakeVscode(editor);
            const logger = {error: sinon.spy()};
            const decorationOperatorFactory = {create: sinon.spy()};
            const debouncer = {debounce: callback => callback()};
            new App({decorationOperatorFactory, logger, debouncer, vscode}).refreshDecorationsWithDelay('DOCUMENT_CHANGE_EVENT');
            expect(decorationOperatorFactory.create).to.have.been.not.called;
        });

        test('it logs error if an exception occurred', () => {
            const logger = {error: sinon.spy()};
            new App({logger}).refreshDecorationsWithDelay('EDITOR');
            expect(logger.error.args[0][0]).to.have.string('TypeError: Cannot read property \'window\' of undefined');
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
        return {
            window: {
                visibleTextEditors: editor ? [editor] : [],
                activeTextEditor: editor
            }
        };
    }

    function getLogger() {
        return console;
    }
});
