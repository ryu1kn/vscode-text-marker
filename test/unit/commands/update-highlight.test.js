
const UpdateHighlightCommand = require('../../../lib/commands/update-highlight');

suite('UpdateHighlightCommand', () => {

    test('it update decoration if the cursor is on highlight', () => {
        const editor = {selectedText: null};
        const textEditorFactory = {create: () => editor};
        const textLocationRegistry = {queryDecorationId: () => 'DECORATION_ID'};
        const decorationOperator = {updateDecoration: sinon.spy()};
        const decorationOperatorFactory = {createForVisibleEditors: () => decorationOperator};
        const decorationVariationReader = {read: sinon.stub().returns(Promise.resolve('NEW_DECORATION'))};
        const command = new UpdateHighlightCommand({
            decorationOperatorFactory,
            decorationVariationReader,
            textEditorFactory,
            textLocationRegistry
        });

        return command.execute(editor).then(() => {
            expect(decorationVariationReader.read).to.have.been.calledWith('DECORATION_ID');
            expect(decorationOperator.updateDecoration).to.have.been.calledWith('NEW_DECORATION');
        });
    });

});
