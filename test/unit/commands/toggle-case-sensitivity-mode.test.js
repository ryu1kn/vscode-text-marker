
const ToggleCaseSensitivityModeCommand = require('../../../lib/commands/toggle-case-sensitivity-mode');

suite('ToggleCaseSensitivityModeCommand', () => {

    test('it toggles case sensitivity mode', () => {
        const matchingModeRegistry = {toggleCaseSensitivity: sinon.spy()};
        const command = new ToggleCaseSensitivityModeCommand({matchingModeRegistry});

        command.execute();
        expect(matchingModeRegistry.toggleCaseSensitivity).to.have.been.called;
    });

});
