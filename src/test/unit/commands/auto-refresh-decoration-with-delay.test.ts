import {any, callback, contains, mock, mockMethods, mockType, verify, when} from '../../helpers/mock';

import WindowComponent from '../../../lib/vscode/window';
import Debouncer from '../../../lib/debouncer';
import DecorationOperatorFactory from '../../../lib/decoration/decoration-operator-factory';
import TextEditor from '../../../lib/vscode/text-editor';
import DecorationOperator from '../../../lib/decoration/decoration-operator';
import {Logger} from '../../../lib/Logger';
import AutoRefreshDecorationWithDelay from '../../../lib/commands/auto-refresh-decoration-with-delay';

suite('AutoRefreshDecorationWithDelay', () => {

    test('it refreshes text markups but debounce the execution', () => {
        const editor = mock(TextEditor);
        const windowComponent = mockType<WindowComponent>({activeTextEditor: editor});
        const logger = mockType<Logger>();
        const decorationOperator = mock(DecorationOperator);
        const decorationOperatorFactory = mock(DecorationOperatorFactory);
        when(decorationOperatorFactory.create([editor])).thenReturn(decorationOperator);
        const debouncer = mock(Debouncer);
        when(debouncer.debounce(callback)).thenCallback();
        const refresher = new AutoRefreshDecorationWithDelay(decorationOperatorFactory, debouncer, windowComponent, logger);

        refresher.execute();

        verify(decorationOperator.refreshDecorations());
    });

    test('it does nothing if editor is not given when invoked', () => {
        const editor = undefined;
        const windowComponent = mockType<WindowComponent>({activeTextEditor: editor});
        const logger = mockType<Logger>({error: () => {}});
        const decorationOperatorFactory = mock(DecorationOperatorFactory);
        const debouncer = mock(Debouncer);
        when(debouncer.debounce(callback)).thenCallback();
        new AutoRefreshDecorationWithDelay(decorationOperatorFactory, debouncer, windowComponent, logger).execute();
        verify(decorationOperatorFactory.create(any()), {times: 0});
    });

    test('it logs error if an exception occurred', () => {
        const editor = mock(TextEditor);
        const windowComponent = mockType<WindowComponent>({activeTextEditor: editor});
        const debouncer = mockType<Debouncer>({
            debounce: (callback: any) => callback()
        });
        const decorationOperatorFactory = mock(DecorationOperatorFactory);
        when(decorationOperatorFactory.create(any())).thenThrow(new Error('UNEXPECTED_ERROR'));
        const logger = mockMethods<Logger>(['error']);
        new AutoRefreshDecorationWithDelay(decorationOperatorFactory, debouncer, windowComponent, logger).execute();
        verify(logger.error(contains('Error: UNEXPECTED_ERROR')));
    });
});
