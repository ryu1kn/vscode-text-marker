
const ToggleCaseSensitivityModeCommand = require('../../../lib/commands/toggle-case-sensitivity-mode');

suite('ToggleCaseSensitivityModeCommand', () => {

    test('it toggles case sensitivity mode', () => {
        const matchingModeRegistry = {toggleCaseSensitivity: sinon.spy()};
        const command = new ToggleCaseSensitivityModeCommand({matchingModeRegistry});

        command.execute();
        expect(matchingModeRegistry.toggleCaseSensitivity).to.have.been.called;
    });

    test('it logs error if an exception occurred', () => {
        const matchingModeRegistry = {toggleCaseSensitivity: () => {
            throw new Error('UNEXPECTED_ERROR');
        }};
        const logger = {error: sinon.spy()};
        const command = new ToggleCaseSensitivityModeCommand({matchingModeRegistry, logger});

        command.execute();
        expect(logger.error.args[0][0]).to.have.string('Error: UNEXPECTED_ERROR');
    });

});
