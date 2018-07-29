import {mock, verify, when} from '../../helpers/helper';
import SaveAllHighlightsCommand from '../../../lib/commands/save-all-highlights';
import DecorationRegistry from "../../../lib/decoration-registry";
import ConfigStore from "../../../lib/config-store";

suite('SaveAllHighlightsCommand', () => {
    let command;
    let configStore;
    const decorations = [{
        id: 'ID1',
        colour: 'COLOUR1',
        pattern: {
            type: 'String',
            phrase: 'PHRASE',
            ignoreCase: 'IGNORE_CASE',
            wholeMatch: 'WHOLE_MATCH'
        }
    }, {
        id: 'ID2',
        colour: 'COLOUR2',
        pattern: {
            type: 'RegExp',
            phrase: 'PHRASE',
            ignoreCase: 'IGNORE_CASE',
            wholeMatch: 'WHOLE_MATCH'
        }
    }];

    const decorationRegistry = mock(DecorationRegistry);
    when(decorationRegistry.retrieveAll()).thenReturn(decorations);

    configStore = mock(ConfigStore);

    command = new SaveAllHighlightsCommand(configStore, decorationRegistry);

    test('it saves highlight into config', async () => {
        await command.execute();

        verify(configStore.set('savedHighlights', [{
            pattern: {
                type: 'string',
                expression: 'PHRASE',
                ignoreCase: 'IGNORE_CASE',
                wholeMatch: 'WHOLE_MATCH'
            }
        }, {
            pattern: {
                type: 'regex',
                expression: 'PHRASE',
                ignoreCase: 'IGNORE_CASE',
                wholeMatch: 'WHOLE_MATCH'
            }
        }]));
    });
});
