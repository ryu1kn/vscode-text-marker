import {mock, verify, when} from '../../helpers/mock';
import ToggleCaseSensitivityCommand from '../../../lib/commands/toggle-case-sensitivity';
import DecorationPicker from '../../../lib/decoration/decoration-picker';
import DecorationOperatorFactory from '../../../lib/decoration/decoration-operator-factory';
import DecorationOperator from '../../../lib/decoration/decoration-operator';
import {Decoration} from '../../../lib/entities/decoration';
import StringPattern from '../../../lib/pattern/string';
import {none, some} from 'fp-ts/lib/Option';

suite('ToggleCaseSensitivityCommand', () => {

    suite('When text is selected', () => {
        const decorationOperator = mock(DecorationOperator);
        const decorationOperatorFactory = mock(DecorationOperatorFactory);
        when(decorationOperatorFactory.createForVisibleEditors()).thenReturn(decorationOperator);

        const pattern = new StringPattern({phrase: 'TEXT'});
        const decoration = new Decoration('UUID', pattern, 'pink');
        const decorationPicker = mock(DecorationPicker);
        when(decorationPicker.pick('Select a pattern to toggle case sensitivity')).thenResolve(some(decoration));

        const command = new ToggleCaseSensitivityCommand(decorationOperatorFactory, decorationPicker);

        test('it toggles case sensitivity of the decoration', async () => {
            await command.execute();

            verify(decorationOperator.updateDecoration(decoration, decoration.withCaseSensitivityToggled()));
        });
    });

    suite('When pattern is NOT selected', () => {
        const decorationOperatorFactory = mock(DecorationOperatorFactory);
        const decorationPicker = mock(DecorationPicker);
        when(decorationPicker.pick('Select a pattern to toggle case sensitivity')).thenResolve(none);
        const command = new ToggleCaseSensitivityCommand(decorationOperatorFactory, decorationPicker);

        test('it does nothing', async () => {
            await command.execute();

            verify(decorationOperatorFactory.createForVisibleEditors(), {times: 0});
        });
    });

});
