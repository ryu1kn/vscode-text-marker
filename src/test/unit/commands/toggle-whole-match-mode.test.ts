import {mock, verify} from '../../helpers/helper';

import ToggleWholeMatchModeCommand from '../../../lib/commands/toggle-whole-match-mode';
import MatchingModeRegistry from '../../../lib/matching-mode-registry';

suite('ToggleWholeMatchModeCommand', () => {

    const matchingModeRegistry = mock(MatchingModeRegistry);
    const command = new ToggleWholeMatchModeCommand(matchingModeRegistry);

    test('it toggles case sensitivity mode', () => {
        command.execute();
        verify(matchingModeRegistry.toggleWholeMatch());
    });

});
