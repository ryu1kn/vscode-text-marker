import {mock, when, verify} from '../../helpers/helper';
import HighlightUsingRegexCommand from '../../../lib/commands/highlight-using-regex';
import DecorationOperatorFactory from "../../../lib/decoration-operator-factory";
import RegexReader from "../../../lib/regex-reader";
import DecorationOperator from "../../../lib/decoration-operator";

suite('HighlightUsingRegexCommand', () => {

    suite('When regex is given', () => {
        const decorationOperator = mock(DecorationOperator);
        const decorationOperatorFactory = mock(DecorationOperatorFactory);
        when(decorationOperatorFactory.createForVisibleEditors()).thenReturn(decorationOperator);

        const regexReader = mock(RegexReader);
        when(regexReader.read()).thenResolve('PATTERN');

        const command = new HighlightUsingRegexCommand(decorationOperatorFactory, regexReader);

        test('it decorates text that matches to the specified regex', async () => {
            await command.execute();

            verify(decorationOperator.addDecoration('PATTERN'));
        });
    })

    suite('When regex is NOT given', () => {
        const decorationOperatorFactory = mock(DecorationOperatorFactory);

        const regexReader = mock(RegexReader);
        when(regexReader.read()).thenResolve();

        const command = new HighlightUsingRegexCommand(decorationOperatorFactory, regexReader);

        test('it does nothing if regex is not given', async () => {
            await command.execute();

            verify(decorationOperatorFactory.createForVisibleEditors(), {times: 0});
        });
    });
});
