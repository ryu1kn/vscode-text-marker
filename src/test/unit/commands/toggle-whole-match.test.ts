import {any, mock, mockType, verify, when} from '../../helpers/mock';
import ToggleWholeMatchCommand from '../../../lib/commands/toggle-whole-match';
import DecorationOperator from '../../../lib/decoration/decoration-operator';
import DecorationOperatorFactory from '../../../lib/decoration/decoration-operator-factory';
import DecorationPicker from '../../../lib/decoration/decoration-picker';
import {Decoration} from '../../../lib/entities/decoration';
import StringPattern from '../../../lib/pattern/string';

suite('ToggleWholeMatchCommand', () => {

    test('it toggles partial/whole match of the decoration', async () => {
        const decorationOperator = mock(DecorationOperator);
        const decorationOperatorFactory = mock(DecorationOperatorFactory);
        when(decorationOperatorFactory.createForVisibleEditors()).thenReturn(decorationOperator);

        const pattern = new StringPattern({phrase: 'TEXT'});
        const decoration = mockType<Decoration>({pattern});
        const decorationPicker = mock(DecorationPicker);
        when(decorationPicker.pick('Select a pattern to toggle partial/whole match')).thenResolve(decoration);
        const command = new ToggleWholeMatchCommand(decorationOperatorFactory, decorationPicker);

        await command.execute();

        verify(decorationOperator.updateDecorationPattern(decoration, pattern.toggleWholeMatch()));
    });

    test('it does nothing if text is not selected', async () => {
        const decorationOperatorFactory = mock(DecorationOperatorFactory);
        const decorationPicker = mock(DecorationPicker);
        when(decorationPicker.pick(any())).thenResolve();
        const command = new ToggleWholeMatchCommand(decorationOperatorFactory, decorationPicker);

        await command.execute();

        verify(decorationOperatorFactory.createForVisibleEditors(), {times: 0});
    });

});
