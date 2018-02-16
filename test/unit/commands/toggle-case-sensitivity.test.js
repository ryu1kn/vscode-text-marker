
const PatternAction = require('../../../lib/const').PatternAction;
const ToggleCaseSensitivityCommand = require('../../../lib/commands/toggle-case-sensitivity');

suite('ToggleCaseSensitivityCommand', () => {

    test('it toggles case sensitivity of the decoration', async () => {
        const decorationOperator = {updateDecorationWithPatternAction: sinon.spy()};
        const decorationOperatorFactory = {createForVisibleEditors: () => decorationOperator};
        const highlightPatternPicker = {pick: sinon.stub().returns(Promise.resolve('DECORATION_ID'))};
        const command = new ToggleCaseSensitivityCommand({decorationOperatorFactory, highlightPatternPicker});

        await command.execute();

        expect(decorationOperator.updateDecorationWithPatternAction).to.have.been.calledWith('DECORATION_ID', PatternAction.TOGGLE_CASE_SENSITIVITY);
        expect(highlightPatternPicker.pick).to.have.been.calledWith('Select a pattern to toggle case sensitivity');
    });

    test('it does nothing if text is not selected', async () => {
        const decorationOperatorFactory = {createForVisibleEditors: sinon.spy()};
        const highlightPatternPicker = {pick: () => Promise.resolve()};
        const command = new ToggleCaseSensitivityCommand({decorationOperatorFactory, highlightPatternPicker});

        await command.execute();

        expect(decorationOperatorFactory.createForVisibleEditors).to.have.been.not.called;
    });

});
