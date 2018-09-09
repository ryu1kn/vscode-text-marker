import {mock, mockType, verify, when} from '../../helpers/mock';
import {PatternAction} from '../../../lib/pattern/pattern-action';
import ToggleCaseSensitivityCommand from '../../../lib/commands/toggle-case-sensitivity';
import DecorationPicker from '../../../lib/decoration/decoration-picker';
import DecorationOperatorFactory from '../../../lib/decoration/decoration-operator-factory';
import DecorationOperator from '../../../lib/decoration/decoration-operator';
import {Decoration} from '../../../lib/entities/decoration';

suite('ToggleCaseSensitivityCommand', () => {

    suite('When text is selected', () => {
        const decorationOperator = mock(DecorationOperator);
        const decorationOperatorFactory = mock(DecorationOperatorFactory);
        when(decorationOperatorFactory.createForVisibleEditors()).thenReturn(decorationOperator);

        const decoration = mockType<Decoration>();
        const decorationPicker = mock(DecorationPicker);
        when(decorationPicker.pick('Select a pattern to toggle case sensitivity')).thenResolve(decoration);

        const command = new ToggleCaseSensitivityCommand(decorationOperatorFactory, decorationPicker);

        test('it toggles case sensitivity of the decoration', async () => {
            await command.execute();

            verify(decorationOperator.updateDecorationWithPatternAction(decoration, PatternAction.TOGGLE_CASE_SENSITIVITY));
        });
    });

    suite('When text is NOT selected', () => {
        const decorationOperatorFactory = mock(DecorationOperatorFactory);
        const decorationPicker = mock(DecorationPicker);
        const command = new ToggleCaseSensitivityCommand(decorationOperatorFactory, decorationPicker);

        test('it does nothing if text is not selected', async () => {
            await command.execute();

            verify(decorationOperatorFactory.createForVisibleEditors(), {times: 0});
        });
    });

});
