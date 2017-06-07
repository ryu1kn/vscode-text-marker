
const RemoveAllHighlightsCommand = require('../../../lib/commands/remove-all-highlights');

suite('RemoveAllHighlightsCommand', () => {

    test('it lets DecorationOperator to remove all decorations', () => {
        const windowComponent = {visibleTextEditors: ['EDITOR_1', 'EDITOR_2']};
        const decorationOperator = {removeAllDecorations: sinon.spy()};
        const decorationOperatorFactory = {create: sinon.stub().returns(decorationOperator)};
        new RemoveAllHighlightsCommand({decorationOperatorFactory, windowComponent}).execute();

        expect(decorationOperatorFactory.create).to.have.been.calledWith(['EDITOR_1', 'EDITOR_2']);
        expect(decorationOperator.removeAllDecorations).to.have.been.calledWith();
    });

});
