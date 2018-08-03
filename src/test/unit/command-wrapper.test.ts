import {contains, mockType, mockMethods, verify} from '../helpers/helper';

import CommandWrapper from '../../lib/command-wrapper';
import {Logger} from '../../lib/Logger';
import {CommandLike} from '../../lib/editor-components/vscode';
import * as vscode from 'vscode';

suite('CommandWrapper', () => {

    test('it executes given command with same args', async () => {
        const command = mockMethods<CommandLike>(['execute']);
        const commandWrapper = new CommandWrapper(command, mockType<Logger>());
        const editor = mockType<vscode.TextEditor>();

        commandWrapper.execute(editor);

        verify(command.execute(editor));
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
