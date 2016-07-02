
const App = require('../../lib/app');
const Throttle = require('../../lib/throttle');

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
            const textDecorator = {decorate: sinon.spy()};
            new App({decorationRegistry, textDecorator, vscode, logger}).markText(editor);

            expect(textDecorator.decorate).to.have.been.calledWith(
                [editor], 'DECORATION_TYPE', 'SELECTED'
            );
        });

        test('Selecting already selected text is de-highlights the selected strings', () => {
            const editor = fakeEditor('SELECTED', 'STR1 SELECTED STR2 SELECTED');
            const vscode = fakeVscode(editor);
            const logger = getLogger();
            const decorationRegistry = {
                inquire: stubWithArgs(['SELECTED'], 'DECORATION_TYPE'),
                revoke: sinon.spy()
            };
            const textDecorator = {undecorate: sinon.spy()};
            new App({decorationRegistry, textDecorator, vscode, logger}).markText(editor);

            expect(decorationRegistry.revoke).to.have.been.calledWith('SELECTED');
            expect(textDecorator.undecorate).to.have.been.calledWith(
                [editor], 'DECORATION_TYPE'
            );
        });

        test('it does nothing if text is not selected', () => {
            const editor = fakeEditor('', 'ENTIRE TEXT');
            const decorationRegistry = {
                inquire: stubWithArgs(['SELECTED'], 'DECORATION_TYPE'),
                revoke: sinon.spy()
            };
            new App({decorationRegistry}).markText(editor);
            expect(decorationRegistry.inquire).to.have.been.not.called;
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
            const editor = 'EDITOR';
            const logger = getLogger();
            const decorationRegistry = {
                retrieveAll: () => ({TEXT_1: 'DECORATION_TYPE_1', TEXT_2: 'DECORATION_TYPE_2'})
            };
            const textDecorator = {decorate: sinon.spy()};
            new App({decorationRegistry, textDecorator, logger}).refreshDecorations(editor);

            expect(textDecorator.decorate.args).to.eql([
                [[editor], 'DECORATION_TYPE_1', 'TEXT_1'],
                [[editor], 'DECORATION_TYPE_2', 'TEXT_2']
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

    suite('#refreshDecorationsWithDelay', () => {

        // TODO: Remove timeout!
        test('it refreshes text markups once the time elapsed certain amount', done => {
            const editor = 'EDITOR';
            const vscode = fakeVscode(editor);
            const logger = getLogger();
            const decorationRegistry = {retrieveAll: () => ({TEXT: 'DECORATION_TYPE'})};
            const textDecorator = {decorate: sinon.spy()};
            const throttle = new Throttle({timeout: 1});
            const app = new App({throttle, decorationRegistry, textDecorator, logger, vscode});

            app.refreshDecorationsWithDelay('DOCUMENT_CHANGE_EVENT_1');
            app.refreshDecorationsWithDelay('DOCUMENT_CHANGE_EVENT_2');
            app.refreshDecorationsWithDelay('DOCUMENT_CHANGE_EVENT_3');

            setTimeout(() => {
                expect(textDecorator.decorate).to.have.been.calledWith(
                    [editor], 'DECORATION_TYPE', 'TEXT'
                );
                done();
            }, 5);
        });

        test('it does nothing if editor is not given when invoked', done => {
            const logger = {error: sinon.spy()};
            const decorationRegistry = {retrieveAll: sinon.spy()};
            const throttle = new Throttle({timeout: 1});
            const vscode = fakeVscode();
            new App({decorationRegistry, logger, throttle, vscode}).refreshDecorationsWithDelay();
            setTimeout(() => {
                expect(decorationRegistry.retrieveAll).to.have.been.not.called;
                done();
            }, 5);
        });

        test('it logs error if an exception occurred', () => {
            const logger = {error: sinon.spy()};
            const decorationRegistry = {
                retrieveAll: () => {throw new Error('RETRIEVE_ALL_ERROR');}
            };
            new App({decorationRegistry, logger}).refreshDecorationsWithDelay('EDITOR');
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
                visibleTextEditors: [editor],
                activeTextEditor: editor
            }
        };
    }

    function getLogger() {
        return console;
    }
});
