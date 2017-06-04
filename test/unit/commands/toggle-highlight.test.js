
const ToggleHighlightCommand = require('../../../lib/commands/toggle-highlight');

suite('ToggleHighlightCommand', () => {

    test('it toggles the decoration of selected text', () => {
        const editor = {selectedText: 'SELECTED'};
        const textEditorFactory = {create: sinon.stub().returns(editor)};
        const windowComponent = {visibleTextEditors: [editor]};
        const decorationOperator = {toggleDecoration: sinon.spy()};
        const decorationOperatorFactory = {create: sinon.stub().returns(decorationOperator)};
        const patternFactory = {create: sinon.stub().returns('PATTERN')};
        const command = new ToggleHighlightCommand({
            decorationOperatorFactory,
            logger: getLogger(),
            patternFactory,
            textEditorFactory,
            windowComponent
        });
        command.execute(editor);

        expect(decorationOperatorFactory.create).to.have.been.calledWith([editor]);
        expect(patternFactory.create).to.have.been.calledWith({phrase: 'SELECTED'});
        expect(decorationOperator.toggleDecoration).to.have.been.calledWith('PATTERN');
    });

    test('it does nothing if text is not selected', () => {
        const editor = 'EDITOR';
        const decorationOperatorFactory = {create: sinon.spy()};
        const textEditorFactory = {create: () => ({selectedText: null})};
        new ToggleHighlightCommand({decorationOperatorFactory, textEditorFactory}).execute(editor);
        expect(decorationOperatorFactory.create).to.have.been.not.called;
    });

    test('it logs error if an exception occurred', () => {
        const logger = {error: sinon.spy()};
        const textEditorFactory = {
            create: () => {throw new Error('UNEXPECTED_ERROR');}
        };
        const editor = 'EDITOR';
        new ToggleHighlightCommand({logger, textEditorFactory}).execute(editor);
        expect(logger.error.args[0][0]).to.have.string('Error: UNEXPECTED_ERROR');
    });

    function getLogger() {
        return console;
    }
});
