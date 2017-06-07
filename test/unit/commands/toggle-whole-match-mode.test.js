
const ToggleWholeMatchModeCommand = require('../../../lib/commands/toggle-whole-match-mode');

suite('ToggleWholeMatchModeCommand', () => {

    test('it toggles case sensitivity mode', () => {
        const matchingModeRegistry = {toggleWholeMatch: sinon.spy()};
        const command = new ToggleWholeMatchModeCommand({matchingModeRegistry});

        command.execute();
        expect(matchingModeRegistry.toggleWholeMatch).to.have.been.called;
    });

});
