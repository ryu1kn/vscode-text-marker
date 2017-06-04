
const HighlightCommand = require('../../../lib/commands/highlight');

suite('HighlightCommand', () => {

    test('it highlights the selected text', () => {
        const editor = {selectedText: 'SELECTED'};
        const textEditorFactory = {create: sinon.stub().returns(editor)};
        const windowComponent = {visibleTextEditors: [editor]};
        const decorationOperator = {addDecoration: sinon.spy()};
        const decorationOperatorFactory = {create: sinon.stub().returns(decorationOperator)};
        const patternFactory = {create: sinon.stub().returns('PATTERN')};
        const command = new HighlightCommand({
            decorationOperatorFactory,
            vsWindow: fakeVscodeWindow(editor),
            logger: getLogger(),
            textEditorFactory,
            windowComponent,
            patternFactory
        });
        command.execute('EDITOR');

        expect(decorationOperatorFactory.create).to.have.been.calledWith([editor]);
        expect(patternFactory.create).to.have.been.calledWith({phrase: 'SELECTED'});
        expect(decorationOperator.addDecoration).to.have.been.calledWith('PATTERN');
    });

    test('it does nothing if text is not selected', () => {
        const editor = 'EDITOR';
        const decorationOperatorFactory = {create: sinon.spy()};
        const textEditorFactory = {create: () => ({selectedText: null})};
        new HighlightCommand({decorationOperatorFactory, textEditorFactory}).execute(editor);
        expect(decorationOperatorFactory.create).to.have.been.not.called;
    });

    test('it logs error if an exception occurred', () => {
        const logger = {error: sinon.spy()};
        const textEditorFactory = {
            create: () => {throw new Error('UNEXPECTED_ERROR');}
        };
        const editor = 'EDITOR';
        new HighlightCommand({logger, textEditorFactory}).execute(editor);
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
