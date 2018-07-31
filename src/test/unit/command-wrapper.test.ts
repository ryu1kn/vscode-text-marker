import {contains, expect, mock, sinon, verify} from '../helpers/helper';

import CommandWrapper from '../../lib/command-wrapper';
import {Logger} from '../../lib/Logger';
import DummyLogger from '../helpers/Logger';

suite('CommandWrapper', () => {

    test('it executes given command with same args', async () => {
        const command = {execute: sinon.spy()};
        const commandWrapper = new CommandWrapper(command, {} as Logger);

        commandWrapper.execute('ARG1', 'ARG2');

        expect(command.execute).to.have.been.calledWith('ARG1', 'ARG2');
    });

    test('it logs a synchronously thrown error', async () => {
        const command = {execute: () => {
            throw new Error('UNEXPECTED_ERROR');
        }};
        const logger = mock(DummyLogger);
        const commandWrapper = new CommandWrapper(command, logger);

        await commandWrapper.execute();

        verify(logger.error(contains('UNEXPECTED_ERROR')));
    });

    test('it logs an asynchronously thrown error', async () => {
        const command = {execute: () => Promise.reject(new Error('UNEXPECTED_ERROR'))};
        const logger = mock(DummyLogger);
        const commandWrapper = new CommandWrapper(command, logger);

        await commandWrapper.execute();

        verify(logger.error(contains('UNEXPECTED_ERROR')));
    });

});
