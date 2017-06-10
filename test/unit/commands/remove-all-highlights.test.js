
const RemoveAllHighlightsCommand = require('../../../lib/commands/remove-all-highlights');

suite('RemoveAllHighlightsCommand', () => {

    test('it lets DecorationOperator to remove all decorations', () => {
        const decorationOperator = {removeAllDecorations: sinon.spy()};
        const decorationOperatorFactory = {createForVisibleEditors: () => decorationOperator};
        new RemoveAllHighlightsCommand({decorationOperatorFactory}).execute();

        expect(decorationOperator.removeAllDecorations).to.have.been.calledWith();
    });

});
