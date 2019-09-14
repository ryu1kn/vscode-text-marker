import {mock, verify, when} from '../../helpers/mock';
import ToggleWholeMatchCommand from '../../../lib/commands/toggle-whole-match';
import DecorationOperator from '../../../lib/decoration/decoration-operator';
import DecorationOperatorFactory from '../../../lib/decoration/decoration-operator-factory';
import DecorationPicker from '../../../lib/decoration/decoration-picker';
import {Decoration} from '../../../lib/entities/decoration';
import StringPattern from '../../../lib/pattern/string';
import {none, some} from 'fp-ts/lib/Option';
import {task} from 'fp-ts/lib/Task';

suite('ToggleWholeMatchCommand', () => {

    test('it toggles partial/whole match of the decoration', async () => {
        const decorationOperator = mock(DecorationOperator);
        const decorationOperatorFactory = mock(DecorationOperatorFactory);
        when(decorationOperatorFactory.createForVisibleEditors()).thenReturn(decorationOperator);

        const pattern = new StringPattern({phrase: 'TEXT'});
        const decoration = new Decoration('UUID', pattern, 'pink');
        const decorationPicker = mock(DecorationPicker);
        when(decorationPicker.pick('Select a pattern to toggle partial/whole match')).thenReturn(task.of(some(decoration)));
        const command = new ToggleWholeMatchCommand(decorationOperatorFactory, decorationPicker);

        await command.execute();

        verify(decorationOperator.updateDecoration(decoration, decoration.withWholeMatchToggled()));
    });

    test('it does nothing if text is not selected', async () => {
        const decorationOperatorFactory = mock(DecorationOperatorFactory);
        const decorationPicker = mock(DecorationPicker);
        when(decorationPicker.pick('Select a pattern to toggle partial/whole match')).thenReturn(task.of(none));

        const command = new ToggleWholeMatchCommand(decorationOperatorFactory, decorationPicker);

        await command.execute();

        verify(decorationOperatorFactory.createForVisibleEditors(), {times: 0});
    });

});
