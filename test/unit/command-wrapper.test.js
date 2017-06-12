
const CommandWrapper = require('../../lib/command-wrapper');

suite('CommandWrapper', () => {

    test('it executes given command with same args', () => {
        const command = {execute: sinon.spy()};
        const commandWrapper = new CommandWrapper({command});

        return commandWrapper.execute('ARG1', 'ARG2').then(() => {
            expect(command.execute).to.have.been.calledWith('ARG1', 'ARG2');
        });
    });

    test('it logs a synchronously thrown error', () => {
        const command = {execute: () => {
            throw new Error('UNEXPECTED_ERROR');
        }};
        const logger = {error: sinon.spy()};
        const commandWrapper = new CommandWrapper({command, logger});

        return commandWrapper.execute().then(() => {
            expect(logger.error.args[0][0]).to.have.string('UNEXPECTED_ERROR');
        });
    });

    test('it logs an asynchronously thrown error', () => {
        const command = {execute: () => Promise.reject(new Error('UNEXPECTED_ERROR'))};
        const logger = {error: sinon.spy()};
        const commandWrapper = new CommandWrapper({command, logger});

        return commandWrapper.execute().then(() => {
            expect(logger.error.args[0][0]).to.have.string('UNEXPECTED_ERROR');
        });
    });

});
