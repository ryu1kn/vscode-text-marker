import {contains, mockType, mockMethods, verify, mock, when} from '../helpers/helper';

import CommandWrapper from '../../lib/command-wrapper';
import {Logger} from '../../lib/Logger';
import {CommandLike} from '../../lib/editor-components/vscode';
import * as vscode from 'vscode';
import TextEditorFactory from '../../lib/text-editor-factory';
import TextEditor from '../../lib/text-editor';

suite('CommandWrapper', () => {

    const rawEditor = mockType<vscode.TextEditor>();
    const editor = mock(TextEditor);

    const textEditorFactory = mock(TextEditorFactory);
    when(textEditorFactory.create(rawEditor)).thenReturn(editor);

    test('it executes given command with our own editor', async () => {
        const command = mockMethods<CommandLike>(['execute']);
        const commandWrapper = new CommandWrapper(command, textEditorFactory, mockType<Logger>());

        commandWrapper.execute(rawEditor);

        verify(command.execute(editor));
    });

    test('it logs a synchronously thrown error', async () => {
        const command = {execute: () => {
            throw new Error('UNEXPECTED_ERROR');
        }};
        const logger = mockMethods<Logger>(['error']);
        const commandWrapper = new CommandWrapper(command, textEditorFactory, logger);

        await commandWrapper.execute();

        verify(logger.error(contains('UNEXPECTED_ERROR')));
    });

    test('it logs an asynchronously thrown error', async () => {
        const command = {execute: () => Promise.reject(new Error('UNEXPECTED_ERROR'))};
        const logger = mockMethods<Logger>(['error']);
        const commandWrapper = new CommandWrapper(command, textEditorFactory, logger);

        await commandWrapper.execute();

        verify(logger.error(contains('UNEXPECTED_ERROR')));
    });

});
