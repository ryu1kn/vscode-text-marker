
const MarkTextCommand = require('../../../lib/commands/mark-text');

suite('MarkTextCommand', () => {

    test('it toggles the decoration of selected text', () => {
        const editor = {selectedText: 'SELECTED'};
        const textEditorFactory = {create: sinon.stub().returns(editor)};
        const decorationOperator = {toggleDecoration: sinon.spy()};
        const decorationOperatorFactory = {createForVisibleEditors: () => decorationOperator};
        const patternFactory = {create: sinon.stub().returns('PATTERN')};
        const command = new MarkTextCommand({
            decorationOperatorFactory,
            patternFactory,
            textEditorFactory
        });
        command.execute(editor);

        expect(patternFactory.create).to.have.been.calledWith({phrase: 'SELECTED'});
        expect(decorationOperator.toggleDecoration).to.have.been.calledWith('PATTERN');
    });

    test('it does nothing if text is not selected', () => {
        const editor = 'EDITOR';
        const decorationOperatorFactory = {createForVisibleEditors: sinon.spy()};
        const textEditorFactory = {create: () => ({selectedText: null})};
        new MarkTextCommand({decorationOperatorFactory, textEditorFactory}).execute(editor);
        expect(decorationOperatorFactory.createForVisibleEditors).to.have.been.not.called;
    });

});
