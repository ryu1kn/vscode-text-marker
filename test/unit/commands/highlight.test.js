
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
            textEditorFactory,
            windowComponent,
            patternFactory
        });
        command.execute(editor);

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

});
