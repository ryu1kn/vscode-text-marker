import {mock, verify} from '../../helpers/helper';

import ToggleCaseSensitivityModeCommand from '../../../lib/commands/toggle-case-sensitivity-mode';
import MatchingModeRegistry from '../../../lib/matching-mode-registry';

suite('ToggleCaseSensitivityModeCommand', () => {

    const matchingModeRegistry = mock(MatchingModeRegistry);
    const command = new ToggleCaseSensitivityModeCommand(matchingModeRegistry);

    test('it toggles case sensitivity mode', () => {
        command.execute();
        verify(matchingModeRegistry.toggleCaseSensitivity());
    });

});
