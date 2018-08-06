import {contains, mockMethods, mockType, verify} from '../helpers/mock';

import CommandWrapper from '../../lib/command-wrapper';
import {Logger} from '../../lib/Logger';
import {CommandLike} from '../../lib/editor-components/vscode';
import * as vscode from 'vscode';
import TextEditor from '../../lib/text-editor';

suite('CommandWrapper', () => {

    const rawEditor = mockType<vscode.TextEditor>();

    test('it executes given command with our own editor', async () => {
        const command = mockMethods<CommandLike>(['execute']);
        const commandWrapper = new CommandWrapper(command, mockType<Logger>());

        commandWrapper.execute(rawEditor);

        verify(command.execute(new TextEditor(rawEditor)));
    });

    test('it logs a synchronously thrown error', async () => {
        const command = {execute: () => {
            throw new Error('UNEXPECTED_ERROR');
        }};
        const logger = mockMethods<Logger>(['error']);
        const commandWrapper = new CommandWrapper(command, logger);

        await commandWrapper.execute();

        verify(logger.error(contains('UNEXPECTED_ERROR')));
    });

    test('it logs an asynchronously thrown error', async () => {
        const command = {execute: () => Promise.reject(new Error('UNEXPECTED_ERROR'))};
        const logger = mockMethods<Logger>(['error']);
        const commandWrapper = new CommandWrapper(command, logger);

        await commandWrapper.execute();

        verify(logger.error(contains('UNEXPECTED_ERROR')));
    });

});
