
const MarkTextCommand = require('../../../lib/commands/mark-text');

suite('MarkTextCommand', () => {

    test('it toggles the decoration of selected text', () => {
        const editor = 'EDITOR';
        const selectedTextFinder = {find: sinon.stub().returns('SELECTED')};
        const vsWindow = fakeVscodeWindow(editor);
        const logger = getLogger();
        const decorationOperator = {toggleDecoration: sinon.spy()};
        const decorationOperatorFactory = {create: sinon.stub().returns(decorationOperator)};
        new MarkTextCommand({decorationOperatorFactory, vsWindow, logger, selectedTextFinder}).execute(editor);

        expect(selectedTextFinder.find).to.have.been.calledWith(editor);
        expect(decorationOperatorFactory.create).to.have.been.calledWith([editor]);
        expect(decorationOperator.toggleDecoration).to.have.been.calledWith('SELECTED');
    });

    test('it does nothing if text is not selected', () => {
        const editor = 'EDITOR';
        const selectedTextFinder = {find: sinon.spy()};
        const decorationOperatorFactory = {create: sinon.spy()};
        new MarkTextCommand({decorationOperatorFactory, selectedTextFinder}).execute(editor);
        expect(decorationOperatorFactory.create).to.have.been.not.called;
    });

    test('it logs error if an exception occurred', () => {
        const logger = {error: sinon.spy()};
        const selectedTextFinder = {
            find: () => {throw new Error('UNEXPECTED_ERROR');}
        };
        const editor = 'EDITOR';
        new MarkTextCommand({logger, selectedTextFinder}).execute(editor);
        expect(logger.error.args[0][0]).to.have.string('Error: UNEXPECTED_ERROR');
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
