import {expect, sinon} from '../../helpers/helper';

import {PatternAction} from '../../../lib/const';
import ToggleWholeMatchCommand from '../../../lib/commands/toggle-whole-match';

suite('ToggleWholeMatchCommand', () => {

    test('it toggles partial/whole match of the decoration', async () => {
        const decorationOperator = {updateDecorationWithPatternAction: sinon.spy()};
        const decorationOperatorFactory = {createForVisibleEditors: () => decorationOperator};
        const highlightPatternPicker = {pick: sinon.stub().returns(Promise.resolve('DECORATION_ID'))};
        const command = new ToggleWholeMatchCommand(decorationOperatorFactory, highlightPatternPicker);

        await command.execute();

        expect(decorationOperator.updateDecorationWithPatternAction).to.have.been.calledWith('DECORATION_ID', PatternAction.TOGGLE_WHOLE_MATCH);
        expect(highlightPatternPicker.pick).to.have.been.calledWith('Select a pattern to toggle partial/whole match');
    });

    test('it does nothing if text is not selected', async () => {
        const decorationOperatorFactory = {createForVisibleEditors: sinon.spy()};
        const highlightPatternPicker = {pick: () => Promise.resolve()};
        const command = new ToggleWholeMatchCommand(decorationOperatorFactory, highlightPatternPicker);

        await command.execute();

        expect(decorationOperatorFactory.createForVisibleEditors).to.have.been.not.called;
    });

});
