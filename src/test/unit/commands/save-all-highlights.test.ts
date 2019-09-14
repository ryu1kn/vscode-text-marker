import {mock, when} from '../../helpers/mock';
import SaveAllHighlightsCommand from '../../../lib/commands/save-all-highlights';
import DecorationRegistry from '../../../lib/decoration/decoration-registry';
import ConfigStore from '../../../lib/config-store';
import {task} from 'fp-ts/lib/Task';
import {none} from 'fp-ts/lib/Option';

suite('SaveAllHighlightsCommand', () => {
    let command: SaveAllHighlightsCommand;
    let configStore: ConfigStore;
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
    when(configStore.set('savedHighlights', [{
        pattern: {
            type: 'string',
            expression: 'PHRASE',
            ignoreCase: 'IGNORE_CASE',
            wholeMatch: 'WHOLE_MATCH'
        },
        color: 'COLOUR1'
    }, {
        pattern: {
            type: 'regex',
            expression: 'PHRASE',
            ignoreCase: 'IGNORE_CASE',
            wholeMatch: 'WHOLE_MATCH'
        },
        color: 'COLOUR2'
    }])).thenReturn(task.of(none));

    command = new SaveAllHighlightsCommand(configStore, decorationRegistry);

    test('it saves highlight into config', async () => {
        await command.execute();
    });
});
