
const ToggleWholeMatchModeCommand = require('../../../lib/commands/toggle-whole-match-mode');

suite('ToggleWholeMatchModeCommand', () => {

    test('it toggles case sensitivity mode', () => {
        const matchingModeRegistry = {toggleWholeMatch: sinon.spy()};
        const command = new ToggleWholeMatchModeCommand({matchingModeRegistry});

        command.execute();
        expect(matchingModeRegistry.toggleWholeMatch).to.have.been.called;
    });

    test('it logs error if an exception occurred', () => {
        const matchingModeRegistry = {toggleWholeMatch: () => {
            throw new Error('UNEXPECTED_ERROR');
        }};
        const logger = {error: sinon.spy()};
        const command = new ToggleWholeMatchModeCommand({matchingModeRegistry, logger});

        command.execute();
        expect(logger.error.args[0][0]).to.have.string('Error: UNEXPECTED_ERROR');
    });

});
