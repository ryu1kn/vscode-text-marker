
const RemoveAllHighlightsCommand = require('../../../lib/commands/remove-all-highlights');

suite('RemoveAllHighlightsCommand', () => {

    test('it lets DecorationOperator to remove all decorations', () => {
        const vsWindow = {visibleTextEditors: ['EDITOR_1', 'EDITOR_2']};
        const logger = getLogger();
        const decorationOperator = {removeAllDecorations: sinon.spy()};
        const decorationOperatorFactory = {create: sinon.stub().returns(decorationOperator)};
        new RemoveAllHighlightsCommand({decorationOperatorFactory, vsWindow, logger}).execute();

        expect(decorationOperatorFactory.create).to.have.been.calledWith(['EDITOR_1', 'EDITOR_2']);
        expect(decorationOperator.removeAllDecorations).to.have.been.calledWith();
    });

    test('it logs error if an exception occurred', () => {
        const vsWindow = {visibleTextEditors: ['EDITOR_1', 'EDITOR_2']};
        const logger = {error: sinon.spy()};
        const decorationOperatorFactory = {
            create: () => {throw new Error('UNEXPECTED_ERROR');}
        };
        new RemoveAllHighlightsCommand({decorationOperatorFactory, vsWindow, logger}).execute();
        expect(logger.error.args[0][0]).to.have.string('Error: UNEXPECTED_ERROR');
    });

    function getLogger() {
        return console;
    }
});
