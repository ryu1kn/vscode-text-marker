import {expect, sinon} from '../../helpers/helper';

import UnhighlightCommand from '../../../lib/commands/unhighlight';

suite('UnhighlightCommand', () => {

    test('it removes one specified highlight', async () => {
        const decorationOperator = {removeDecoration: sinon.spy()};
        const decorationOperatorFactory = {createForVisibleEditors: () => decorationOperator};
        const highlightPatternPicker = {pick: sinon.stub().returns(Promise.resolve('DECORATION_ID'))};
        const command = new UnhighlightCommand(decorationOperatorFactory, highlightPatternPicker);

        await command.execute();

        expect(decorationOperator.removeDecoration).to.have.been.calledWith('DECORATION_ID');
        expect(highlightPatternPicker.pick).to.have.been.calledWith('Select a pattern to remove highlight');
    });

    test('it does nothing if text is not selected', async () => {
        const decorationOperatorFactory = {createForVisibleEditors: sinon.spy()};
        const highlightPatternPicker = {pick: () => Promise.resolve()};
        const command = new UnhighlightCommand(decorationOperatorFactory, highlightPatternPicker);

        await command.execute();

        expect(decorationOperatorFactory.createForVisibleEditors).to.have.been.not.called;
    });

});
