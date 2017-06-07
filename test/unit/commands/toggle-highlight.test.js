
const ToggleHighlightCommand = require('../../../lib/commands/toggle-highlight');

suite('ToggleHighlightCommand', () => {

    test('it decorates a selected text if the cursor is not on highlight', () => {
        const editor = {selectedText: 'SELECTED'};
        const textEditorFactory = {create: sinon.stub().returns(editor)};
        const textLocationRegistry = {queryDecorationId: () => null};
        const windowComponent = {visibleTextEditors: [editor]};
        const decorationOperator = {addDecoration: sinon.spy()};
        const decorationOperatorFactory = {create: sinon.stub().returns(decorationOperator)};
        const patternFactory = {create: sinon.stub().returns('PATTERN')};
        const command = new ToggleHighlightCommand({
            decorationOperatorFactory,
            patternFactory,
            textEditorFactory,
            textLocationRegistry,
            windowComponent
        });
        command.execute(editor);

        expect(decorationOperatorFactory.create).to.have.been.calledWith([editor]);
        expect(patternFactory.create).to.have.been.calledWith({phrase: 'SELECTED'});
        expect(decorationOperator.addDecoration).to.have.been.calledWith('PATTERN');
    });

    test('it remove decoration if the cursor is on highlight', () => {
        const editor = {selectedText: null};
        const textEditorFactory = {create: sinon.stub().returns(editor)};
        const textLocationRegistry = {queryDecorationId: () => 'DECORATION_ID'};
        const windowComponent = {visibleTextEditors: [editor]};
        const decorationOperator = {removeDecoration: sinon.spy()};
        const decorationOperatorFactory = {create: sinon.stub().returns(decorationOperator)};
        const patternFactory = {create: sinon.stub().returns('PATTERN')};
        const command = new ToggleHighlightCommand({
            decorationOperatorFactory,
            patternFactory,
            textEditorFactory,
            textLocationRegistry,
            windowComponent
        });
        command.execute(editor);

        expect(decorationOperatorFactory.create).to.have.been.calledWith([editor]);
        expect(decorationOperator.removeDecoration).to.have.been.calledWith('DECORATION_ID');
    });

    test('it does nothing if text is not selected', () => {
        const editor = 'EDITOR';
        const decorationOperatorFactory = {create: sinon.spy()};
        const textLocationRegistry = {queryDecorationId: () => null};
        const textEditorFactory = {create: () => ({selectedText: null})};
        const command = new ToggleHighlightCommand({decorationOperatorFactory, textEditorFactory, textLocationRegistry});
        command.execute(editor);

        expect(decorationOperatorFactory.create).to.have.been.not.called;
    });

});
