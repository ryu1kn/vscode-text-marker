
const HighlightCommand = require('../../../lib/commands/highlight');

suite('HighlightCommand', () => {

    test('it highlights the selected text', () => {
        const editor = 'EDITOR';
        const selectedTextFinder = {find: sinon.stub().returns('SELECTED')};
        const decorationOperator = {addDecoration: sinon.spy()};
        const decorationOperatorFactory = {create: sinon.stub().returns(decorationOperator)};
        const patternFactory = {create: sinon.stub().returns('PATTERN')};
        const command = new HighlightCommand({
            decorationOperatorFactory,
            vsWindow: fakeVscodeWindow(editor),
            logger: getLogger(),
            selectedTextFinder,
            patternFactory
        });
        command.execute(editor);

        expect(selectedTextFinder.find).to.have.been.calledWith(editor);
        expect(decorationOperatorFactory.create).to.have.been.calledWith([editor]);
        expect(patternFactory.create).to.have.been.calledWith({phrase: 'SELECTED'});
        expect(decorationOperator.addDecoration).to.have.been.calledWith('PATTERN');
    });

    test('it does nothing if text is not selected', () => {
        const editor = 'EDITOR';
        const selectedTextFinder = {find: sinon.spy()};
        const decorationOperatorFactory = {create: sinon.spy()};
        new HighlightCommand({decorationOperatorFactory, selectedTextFinder}).execute(editor);
        expect(decorationOperatorFactory.create).to.have.been.not.called;
    });

    test('it logs error if an exception occurred', () => {
        const logger = {error: sinon.spy()};
        const selectedTextFinder = {
            find: () => {throw new Error('UNEXPECTED_ERROR');}
        };
        const editor = 'EDITOR';
        new HighlightCommand({logger, selectedTextFinder}).execute(editor);
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
