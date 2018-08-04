import {mock, verify, when} from '../../helpers/helper';
import DecorationOperatorFactory from '../../../lib/decoration-operator-factory';
import TextEditor from '../../../lib/text-editor';
import DecorationOperator from '../../../lib/decoration-operator';
import AutoRefreshDecoration from '../../../lib/commands/auto-refresh-decoration';
import {CommandLike} from '../../../lib/editor-components/vscode';

suite('AutoRefreshDecoration', () => {

    let decorationOperator: DecorationOperator;
    let command: CommandLike;

    const editor = {selectedText: 'SELECTED'} as TextEditor;

    setup(() => {
        decorationOperator = mock(DecorationOperator);

        const decorationOperatorFactory = mock(DecorationOperatorFactory);
        when(decorationOperatorFactory.create([editor])).thenReturn(decorationOperator);

        command = new AutoRefreshDecoration(decorationOperatorFactory);
    });

    test('it lets DecorationOperator to refresh decorations', () => {
        command.execute(editor);

        verify(decorationOperator.refreshDecorations());
    });

    test('it does nothing if editor is not given when invoked', () => {
        command.execute();

        verify(decorationOperator.refreshDecorations(), {times: 0});
    });

});
