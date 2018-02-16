
const UpdateHighlightCommand = require('../../../lib/commands/update-highlight');

suite('UpdateHighlightCommand', () => {

    test('it update decoration if the cursor is on highlight', async () => {
        const editor = {selectedText: null};
        const textEditorFactory = {create: () => editor};
        const textLocationRegistry = {queryDecorationId: () => 'DECORATION_ID'};
        const decorationOperator = {updateDecorationPattern: sinon.spy()};
        const decorationOperatorFactory = {createForVisibleEditors: () => decorationOperator};
        const decorationRegistry = {inquireById: stubWithArgs(['DECORATION_ID'], {pattern: 'PATTERN'})};
        const patternVariationReader = {read: stubWithArgs(['PATTERN'], Promise.resolve('NEW_PATTERN'))};
        const command = new UpdateHighlightCommand({
            decorationOperatorFactory,
            decorationRegistry,
            patternVariationReader,
            textEditorFactory,
            textLocationRegistry
        });

        await command.execute(editor);

        expect(patternVariationReader.read).to.have.been.calledWith('PATTERN');
        expect(decorationOperator.updateDecorationPattern).to.have.been.calledWith('DECORATION_ID', 'NEW_PATTERN');
    });

    test('it does nothing if the cursor is not on highlight', async () => {
        const editor = {selectedText: null};
        const textEditorFactory = {create: () => editor};
        const textLocationRegistry = {queryDecorationId: () => null};
        const decorationRegistry = {inquireById: sinon.spy()};
        const command = new UpdateHighlightCommand({
            decorationRegistry,
            textEditorFactory,
            textLocationRegistry
        });

        await command.execute(editor);

        expect(decorationRegistry.inquireById).to.not.have.been.called;
    });

    test('it does nothing if a new pattern is not given by user', async () => {
        const editor = {selectedText: null};
        const textEditorFactory = {create: () => editor};
        const textLocationRegistry = {queryDecorationId: () => 'DECORATION_ID'};
        const decorationOperatorFactory = {createForVisibleEditors: sinon.spy()};
        const decorationRegistry = {inquireById: () => ({pattern: 'CURRENT_PATTERN'})};
        const patternVariationReader = {read: () => Promise.resolve()};
        const command = new UpdateHighlightCommand({
            decorationOperatorFactory,
            decorationRegistry,
            patternVariationReader,
            textEditorFactory,
            textLocationRegistry
        });

        await command.execute(editor);

        expect(decorationOperatorFactory.createForVisibleEditors).to.not.have.been.called;
    });

});
