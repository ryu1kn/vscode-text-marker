
const HighlightCommand = require('../../../lib/commands/highlight');

suite('HighlightCommand', () => {

    test('it highlights the selected text', () => {
        const editor = {selectedText: 'SELECTED'};
        const textEditorFactory = {create: sinon.stub().returns(editor)};
        const decorationOperator = {addDecoration: sinon.spy()};
        const decorationOperatorFactory = {createForVisibleEditors: () => decorationOperator};
        const patternFactory = {create: sinon.stub().returns('PATTERN')};
        const command = new HighlightCommand({
            decorationOperatorFactory,
            textEditorFactory,
            patternFactory
        });
        command.execute(editor);

        expect(patternFactory.create).to.have.been.calledWith({phrase: 'SELECTED'});
        expect(decorationOperator.addDecoration).to.have.been.calledWith('PATTERN');
    });

    test('it does nothing if text is not selected', () => {
        const editor = 'EDITOR';
        const decorationOperatorFactory = {createForVisibleEditors: sinon.spy()};
        const textEditorFactory = {create: () => ({selectedText: null})};
        new HighlightCommand({decorationOperatorFactory, textEditorFactory}).execute(editor);
        expect(decorationOperatorFactory.createForVisibleEditors).to.have.been.not.called;
    });

});
