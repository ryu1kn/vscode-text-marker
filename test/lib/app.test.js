
const App = require('../../lib/app');

suite('App', () => {

    suite('#markText', () => {

        test('it toggles the decoration of selected text', () => {
            const editor = 'EDITOR';
            const selectedTextFinder = {find: sinon.stub().returns('SELECTED')};
            const vsWindow = fakeVscodeWindow(editor);
            const logger = getLogger();
            const decorationOperator = {toggleDecoration: sinon.spy()};
            const decorationOperatorFactory = {create: sinon.stub().returns(decorationOperator)};
            new App({decorationOperatorFactory, vsWindow, logger, selectedTextFinder}).markText(editor);

            expect(selectedTextFinder.find).to.have.been.calledWith(editor);
            expect(decorationOperatorFactory.create).to.have.been.calledWith([editor]);
            expect(decorationOperator.toggleDecoration).to.have.been.calledWith('SELECTED');
        });

        test('it does nothing if text is not selected', () => {
            const editor = 'EDITOR';
            const selectedTextFinder = {find: sinon.spy()};
            const decorationOperatorFactory = {create: sinon.spy()};
            new App({decorationOperatorFactory, selectedTextFinder}).markText(editor);
            expect(decorationOperatorFactory.create).to.have.been.not.called;
        });

        test('it logs error if an exception occurred', () => {
            const logger = {error: sinon.spy()};
            const selectedTextFinder = {
                find: () => {throw new Error('UNEXPECTED_ERROR');}
            };
            const editor = 'EDITOR';
            new App({logger, selectedTextFinder}).markText(editor);
            expect(logger.error.args[0][0]).to.have.string('Error: UNEXPECTED_ERROR');
        });
    });

    suite('#clearAllHighlight', () => {

        test('it lets DecorationOperator to remove all decorations', () => {
            const vsWindow = {visibleTextEditors: ['EDITOR_1', 'EDITOR_2']};
            const logger = getLogger();
            const decorationOperator = {removeAllDecorations: sinon.spy()};
            const decorationOperatorFactory = {create: sinon.stub().returns(decorationOperator)};
            new App({decorationOperatorFactory, vsWindow, logger}).clearAllHighlight();

            expect(decorationOperatorFactory.create).to.have.been.calledWith(['EDITOR_1', 'EDITOR_2']);
            expect(decorationOperator.removeAllDecorations).to.have.been.calledWith();
        });

        test('it logs error if an exception occurred', () => {
            const vsWindow = {visibleTextEditors: ['EDITOR_1', 'EDITOR_2']};
            const logger = {error: sinon.spy()};
            const decorationOperatorFactory = {
                create: () => {throw new Error('UNEXPECTED_ERROR');}
            };
            new App({decorationOperatorFactory, vsWindow, logger}).clearAllHighlight();
            expect(logger.error.args[0][0]).to.have.string('Error: UNEXPECTED_ERROR');
        });
    });

    suite('#refreshDecorations', () => {

        test('it lets DecorationOperator to refresh decorations', () => {
            const editor = 'EDITOR';
            const vsWindow = fakeVscodeWindow(editor);
            const logger = getLogger();
            const decorationOperator = {refreshDecorations: sinon.spy()};
            const decorationOperatorFactory = {create: sinon.stub().returns(decorationOperator)};
            new App({decorationOperatorFactory, vsWindow, logger}).refreshDecorations(editor);

            expect(decorationOperatorFactory.create).to.have.been.calledWith([editor]);
            expect(decorationOperator.refreshDecorations).to.have.been.calledWith();
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
                create: () => {throw new Error('UNEXPECTED_ERROR');}
            };
            new App({decorationOperatorFactory, logger}).refreshDecorations('EDITOR');
            expect(logger.error.args[0][0]).to.have.string('Error: UNEXPECTED_ERROR');
        });
    });

    suite('#refreshDecorationsWithDelay', () => {

        test('it refreshes text markups but debounce the execution', () => {
            const editor = 'EDITOR';
            const vsWindow = fakeVscodeWindow(editor);
            const logger = getLogger();
            const decorationOperator = {refreshDecorations: sinon.spy()};
            const decorationOperatorFactory = {create: sinon.stub().returns(decorationOperator)};
            const debouncer = {debounce: sinon.stub().callsArg(0)};
            const app = new App({debouncer, decorationOperatorFactory, logger, vsWindow});

            app.refreshDecorationsWithDelay('DOCUMENT_CHANGE_EVENT');

            expect(decorationOperatorFactory.create).to.have.been.calledWith([editor]);
            expect(decorationOperator.refreshDecorations).to.have.been.calledWith();
        });

        test('it does nothing if editor is not given when invoked', () => {
            const editor = undefined;
            const vsWindow = fakeVscodeWindow(editor);
            const logger = {error: sinon.spy()};
            const decorationOperatorFactory = {create: sinon.spy()};
            const debouncer = {debounce: callback => callback()};
            new App({decorationOperatorFactory, logger, debouncer, vsWindow}).refreshDecorationsWithDelay('DOCUMENT_CHANGE_EVENT');
            expect(decorationOperatorFactory.create).to.have.been.not.called;
        });

        test('it logs error if an exception occurred', () => {
            const editor = 'EDITOR';
            const vsWindow = fakeVscodeWindow(editor);
            const debouncer = {
                debounce: () => {throw new Error('UNEXPECTED_ERROR');}
            };
            const logger = {error: sinon.spy()};
            new App({logger, debouncer, vsWindow}).refreshDecorationsWithDelay(editor);
            expect(logger.error.args[0][0]).to.have.string('Error: UNEXPECTED_ERROR');
        });
    });

    function fakeVscodeWindow(editor) {
        return {
            visibleTextEditors: editor ? [editor] : [],
            activeTextEditor: editor
        };
    }

    function getLogger() {
        return console;
    }
});
