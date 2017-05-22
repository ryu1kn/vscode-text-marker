
const ClearHighlightCommand = require('../../../lib/commands/clear-highlight');

suite('ClearHighlightCommand', () => {

    test('it removes one specified highlight', () => {
        const vsWindow = {visibleTextEditors: ['EDITOR_1', 'EDITOR_2']};
        const decorationOperator = {removeDecoration: sinon.spy()};
        const decorationOperatorFactory = {create: sinon.stub().returns(decorationOperator)};
        const highlightPatternPicker = {pick: () => Promise.resolve('PATTERN')};
        const command = new ClearHighlightCommand({decorationOperatorFactory, highlightPatternPicker, vsWindow});

        return command.execute().then(() => {
            expect(decorationOperatorFactory.create).to.have.been.calledWith(['EDITOR_1', 'EDITOR_2']);
            expect(decorationOperator.removeDecoration).to.have.been.calledWith('PATTERN');
        });
    });

    test('it logs error if an exception occurred', () => {
        const vsWindow = {visibleTextEditors: ['EDITOR_1', 'EDITOR_2']};
        const logger = {error: sinon.spy()};
        const highlightPatternPicker = {pick: () => Promise.reject(new Error('UNEXPECTED_ERROR'))};
        const command = new ClearHighlightCommand({highlightPatternPicker, vsWindow, logger});

        return command.execute().then(() => {
            expect(logger.error.args[0][0]).to.have.string('Error: UNEXPECTED_ERROR');
        });
    });

});
