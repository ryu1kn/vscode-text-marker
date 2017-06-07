
const MarkTextCommand = require('../../../lib/commands/mark-text');

suite('MarkTextCommand', () => {

    test('it toggles the decoration of selected text', () => {
        const editor = {selectedText: 'SELECTED'};
        const textEditorFactory = {create: sinon.stub().returns(editor)};
        const windowComponent = {visibleTextEditors: [editor]};
        const decorationOperator = {toggleDecoration: sinon.spy()};
        const decorationOperatorFactory = {create: sinon.stub().returns(decorationOperator)};
        const patternFactory = {create: sinon.stub().returns('PATTERN')};
        const command = new MarkTextCommand({
            decorationOperatorFactory,
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
        new MarkTextCommand({decorationOperatorFactory, textEditorFactory}).execute(editor);
        expect(decorationOperatorFactory.create).to.have.been.not.called;
    });

});
