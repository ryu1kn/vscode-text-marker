import {any, mock, verify, when} from '../../helpers/mock';

import UnhighlightCommand from '../../../lib/commands/unhighlight';
import DecorationOperatorFactory from '../../../lib/decoration/decoration-operator-factory';
import DecorationPicker from '../../../lib/decoration/decoration-picker';
import DecorationOperator from '../../../lib/decoration/decoration-operator';

suite('UnhighlightCommand', () => {

    test('it removes one specified highlight', async () => {
        const decorationOperator = mock(DecorationOperator);
        const decorationOperatorFactory = mock(DecorationOperatorFactory);
        when(decorationOperatorFactory.createForVisibleEditors()).thenReturn(decorationOperator);
        const highlightPatternPicker = mock(DecorationPicker);
        when(highlightPatternPicker.pick('Select a pattern to remove highlight')).thenResolve('DECORATION_ID');
        const command = new UnhighlightCommand(decorationOperatorFactory, highlightPatternPicker);

        await command.execute();

        verify(decorationOperator.removeDecoration('DECORATION_ID'));
    });

    test('it does nothing if text is not selected', async () => {
        const decorationOperatorFactory = mock(DecorationOperatorFactory);
        const highlightPatternPicker = mock(DecorationPicker);
        when(highlightPatternPicker.pick(any())).thenResolve();
        const command = new UnhighlightCommand(decorationOperatorFactory, highlightPatternPicker);

        await command.execute();

        verify(decorationOperatorFactory.createForVisibleEditors(), {times: 0});
    });

});
