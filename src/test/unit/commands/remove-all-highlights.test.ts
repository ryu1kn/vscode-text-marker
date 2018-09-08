import {mock, verify, when} from '../../helpers/mock';
import RemoveAllHighlightsCommand from '../../../lib/commands/remove-all-highlights';
import DecorationOperatorFactory from '../../../lib/decoration/decoration-operator-factory';
import DecorationOperator from '../../../lib/decoration/decoration-operator';

suite('RemoveAllHighlightsCommand', () => {
    const decorationOperator = mock(DecorationOperator);
    const decorationOperatorFactory = mock(DecorationOperatorFactory);
    when(decorationOperatorFactory.createForVisibleEditors()).thenReturn(decorationOperator);

    test('it lets DecorationOperator to remove all decorations', () => {
        new RemoveAllHighlightsCommand(decorationOperatorFactory).execute();

        verify(decorationOperator.removeAllDecorations());
    });

});
