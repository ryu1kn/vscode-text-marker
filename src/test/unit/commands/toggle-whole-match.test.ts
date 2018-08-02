import {any, mock, verify, when} from '../../helpers/helper';

import {PatternAction} from '../../../lib/const';
import ToggleWholeMatchCommand from '../../../lib/commands/toggle-whole-match';
import DecorationOperator from "../../../lib/decoration-operator";
import DecorationOperatorFactory from "../../../lib/decoration-operator-factory";
import HighlightPatternPicker from "../../../lib/highlight-pattern-picker";

suite('ToggleWholeMatchCommand', () => {

    test('it toggles partial/whole match of the decoration', async () => {
        const decorationOperator = mock(DecorationOperator);
        const decorationOperatorFactory = mock(DecorationOperatorFactory);
        when(decorationOperatorFactory.createForVisibleEditors()).thenReturn(decorationOperator);
        const highlightPatternPicker = mock(HighlightPatternPicker);
        when(highlightPatternPicker.pick('Select a pattern to toggle partial/whole match')).thenResolve('DECORATION_ID');
        const command = new ToggleWholeMatchCommand(decorationOperatorFactory, highlightPatternPicker);

        await command.execute();

        verify(decorationOperator.updateDecorationWithPatternAction('DECORATION_ID', PatternAction.TOGGLE_WHOLE_MATCH));
    });

    test('it does nothing if text is not selected', async () => {
        const decorationOperatorFactory = mock(DecorationOperatorFactory);
        const highlightPatternPicker = mock(HighlightPatternPicker);
        when(highlightPatternPicker.pick(any())).thenResolve();
        const command = new ToggleWholeMatchCommand(decorationOperatorFactory, highlightPatternPicker);

        await command.execute();

        verify(decorationOperatorFactory.createForVisibleEditors(), {times: 0});
    });

});
