import {
    any,
    callback,
    contains,
    expect,
    mock,
    mockType,
    mockTypeWithMethod,
    sinon,
    verify,
    when
} from '../helpers/helper';

import DecorationRefresher from '../../lib/decoration-refresher';
import WindowComponent from '../../lib/editor-components/window';
import Debouncer from '../../lib/debouncer';
import TextEditorFactory from '../../lib/text-editor-factory';
import DecorationOperatorFactory from '../../lib/decoration-operator-factory';
import TextEditor from '../../lib/text-editor';
import * as vscode from 'vscode';
import DecorationOperator from '../../lib/decoration-operator';
import {Logger} from '../../lib/Logger';

suite('DecorationRefresher', () => {

    const rawEditor = mockType<vscode.TextEditor>({});

    suite('#refresh', () => {

        test('it lets DecorationOperator to refresh decorations', () => {
            const editor = {selectedText: 'SELECTED'} as TextEditor;
            const textEditorFactory = mock(TextEditorFactory);
            when(textEditorFactory.create(rawEditor)).thenReturn(editor);
            const logger = getLogger();
            const decorationOperator = mock(DecorationOperator);
            const decorationOperatorFactory = mock(DecorationOperatorFactory);
            when(decorationOperatorFactory.create([editor])).thenReturn(decorationOperator);
            const debouncer = mock(Debouncer);
            const windowComponent = mock(WindowComponent);
            new DecorationRefresher(decorationOperatorFactory, debouncer, textEditorFactory, windowComponent, logger).refresh(rawEditor);

            verify(decorationOperator.refreshDecorations());
        });

        test('it does nothing if editor is not given when invoked', () => {
            const editor = undefined;
            const logger = {error: sinon.spy()};
            const decorationOperatorFactory = mock(DecorationOperatorFactory);
            const debouncer = mock(Debouncer);
            const textEditorFactory = mock(TextEditorFactory);
            const windowComponent = mock(WindowComponent);
            new DecorationRefresher(decorationOperatorFactory, debouncer, textEditorFactory, windowComponent, logger).refresh(editor);
            verify(decorationOperatorFactory.create(any()), {times: 0});
        });

        test('it logs error if an exception occurred', () => {
            const logger = mockTypeWithMethod<Logger>(['error']);
            const textEditorFactory = mock(TextEditorFactory);
            when(textEditorFactory.create(rawEditor)).thenThrow(new Error('UNEXPECTED_ERROR'));
            const decorationOperatorFactory = mock(DecorationOperatorFactory);
            const debouncer = mock(Debouncer);
            const windowComponent = mock(WindowComponent);
            new DecorationRefresher(decorationOperatorFactory, debouncer, textEditorFactory, windowComponent, logger).refresh(rawEditor);

            verify(logger.error(contains('Error: UNEXPECTED_ERROR')));
        });
    });

    suite('#refreshWithDelay', () => {

        test('it refreshes text markups but debounce the execution', () => {
            const editor = mock(TextEditor);
            const windowComponent = mockType<WindowComponent>({activeTextEditor: editor});
            const logger = getLogger();
            const decorationOperator = {refreshDecorations: sinon.spy()};
            const decorationOperatorFactory = mock(DecorationOperatorFactory);
            when(decorationOperatorFactory.create([editor])).thenReturn(decorationOperator);
            const debouncer = mock(Debouncer);
            when(debouncer.debounce(callback)).thenCallback();
            const textEditorFactory = mock(TextEditorFactory);
            const refresher = new DecorationRefresher(decorationOperatorFactory, debouncer, textEditorFactory, windowComponent, logger);

            refresher.refreshWithDelay('DOCUMENT_CHANGE_EVENT');

            expect(decorationOperator.refreshDecorations).to.have.been.calledWith();
        });

        test('it does nothing if editor is not given when invoked', () => {
            const editor = undefined;
            const windowComponent = mockType<WindowComponent>({activeTextEditor: editor});
            const logger = {error: sinon.spy()};
            const decorationOperatorFactory = mock(DecorationOperatorFactory);
            const debouncer = mock(Debouncer);
            when(debouncer.debounce(callback)).thenCallback();
            const textEditorFactory = mock(TextEditorFactory);
            new DecorationRefresher(decorationOperatorFactory, debouncer, textEditorFactory, windowComponent, logger).refreshWithDelay('DOCUMENT_CHANGE_EVENT');
            verify(decorationOperatorFactory.create(any()), {times: 0});
        });

        test('it logs error if an exception occurred', () => {
            const editor = mock(TextEditor);
            const windowComponent = mockType<WindowComponent>({activeTextEditor: editor});
            const debouncer = mock(Debouncer);
            when(debouncer.debounce(any())).thenThrow(new Error('UNEXPECTED_ERROR'));
            const decorationOperatorFactory = mock(DecorationOperatorFactory);
            const textEditorFactory = mock(TextEditorFactory);
            const logger = mockTypeWithMethod<Logger>(['error']);
            new DecorationRefresher(decorationOperatorFactory, debouncer, textEditorFactory, windowComponent, logger).refreshWithDelay(rawEditor);
            verify(logger.error(contains('Error: UNEXPECTED_ERROR')));
        });
    });

    function getLogger() {
        return console;
    }
});
