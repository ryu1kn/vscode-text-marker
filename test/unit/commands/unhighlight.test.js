
const UnhighlightCommand = require('../../../lib/commands/unhighlight');

suite('UnhighlightCommand', () => {

    test('it removes one specified highlight', () => {
        const decorationOperator = {removeDecoration: sinon.spy()};
        const decorationOperatorFactory = {createForVisibleEditors: () => decorationOperator};
        const highlightPatternPicker = {pick: sinon.stub().returns(Promise.resolve('DECORATION_ID'))};
        const command = new UnhighlightCommand({decorationOperatorFactory, highlightPatternPicker});

        return command.execute().then(() => {
            expect(decorationOperator.removeDecoration).to.have.been.calledWith('DECORATION_ID');
            expect(highlightPatternPicker.pick).to.have.been.calledWith('Select a pattern to remove highlight');
        });
    });

    test('it does nothing if text is not selected', () => {
        const decorationOperatorFactory = {createForVisibleEditors: sinon.spy()};
        const highlightPatternPicker = {pick: () => Promise.resolve()};
        const command = new UnhighlightCommand({decorationOperatorFactory, highlightPatternPicker});

        return command.execute().then(() => {
            expect(decorationOperatorFactory.createForVisibleEditors).to.have.been.not.called;
        });
    });

});
