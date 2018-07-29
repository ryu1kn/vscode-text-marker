import {expect, sinon} from '../helpers/helper';

import CommandWrapper from '../../lib/command-wrapper';

suite('CommandWrapper', () => {

    test('it executes given command with same args', async () => {
        const command = {execute: sinon.spy()};
        const commandWrapper = new CommandWrapper({command} as any);

        commandWrapper.execute('ARG1', 'ARG2');

        expect(command.execute).to.have.been.calledWith('ARG1', 'ARG2');
    });

    test('it logs a synchronously thrown error', async () => {
        const command = {execute: () => {
            throw new Error('UNEXPECTED_ERROR');
        }};
        const logger = {error: sinon.spy()};
        const commandWrapper = new CommandWrapper({command, logger});

        await commandWrapper.execute();

        expect(logger.error.args[0][0]).to.have.string('UNEXPECTED_ERROR');
    });

    test('it logs an asynchronously thrown error', async () => {
        const command = {execute: () => Promise.reject(new Error('UNEXPECTED_ERROR'))};
        const logger = {error: sinon.spy()};
        const commandWrapper = new CommandWrapper({command, logger});

        await commandWrapper.execute();

        expect(logger.error.args[0][0]).to.have.string('UNEXPECTED_ERROR');
    });

});
