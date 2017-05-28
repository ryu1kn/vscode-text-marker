
const UnhighlightCommand = require('../../../lib/commands/unhighlight');

suite('UnhighlightCommand', () => {

    test('it removes one specified highlight', () => {
        const vsWindow = {visibleTextEditors: ['EDITOR_1', 'EDITOR_2']};
        const decorationOperator = {removeDecoration: sinon.spy()};
        const decorationOperatorFactory = {create: sinon.stub().returns(decorationOperator)};
        const highlightPatternPicker = {pick: sinon.stub().returns(Promise.resolve('DECORATION_ID'))};
        const command = new UnhighlightCommand({decorationOperatorFactory, highlightPatternPicker, vsWindow});

        return command.execute().then(() => {
            expect(decorationOperatorFactory.create).to.have.been.calledWith(['EDITOR_1', 'EDITOR_2']);
            expect(decorationOperator.removeDecoration).to.have.been.calledWith('DECORATION_ID');
            expect(highlightPatternPicker.pick).to.have.been.calledWith('Select a pattern to remove highlight');
        });
    });

    test('it does nothing if text is not selected', () => {
        const vsWindow = {visibleTextEditors: ['EDITOR_1', 'EDITOR_2']};
        const decorationOperatorFactory = {create: sinon.spy()};
        const highlightPatternPicker = {pick: () => Promise.resolve()};
        const command = new UnhighlightCommand({decorationOperatorFactory, highlightPatternPicker, vsWindow});

        return command.execute().then(() => {
            expect(decorationOperatorFactory.create).to.have.been.not.called;
        });
    });

    test('it logs error if an exception occurred', () => {
        const vsWindow = {visibleTextEditors: ['EDITOR_1', 'EDITOR_2']};
        const logger = {error: sinon.spy()};
        const highlightPatternPicker = {pick: () => Promise.reject(new Error('UNEXPECTED_ERROR'))};
        const command = new UnhighlightCommand({highlightPatternPicker, vsWindow, logger});

        return command.execute().then(() => {
            expect(logger.error.args[0][0]).to.have.string('Error: UNEXPECTED_ERROR');
        });
    });

});
