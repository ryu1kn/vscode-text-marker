import {any, mock, when} from '../helpers/mock';

import ConfigTargetPicker from '../../lib/config-target-picker';
import WindowComponent from '../../lib/vscode/window';
import * as assert from 'assert';
import {none, some} from 'fp-ts/lib/Option';

suite('ConfigTargetPicker', () => {

    test('it lets user to select which level they want to save a config', async () => {
        const windowComponent = mock(WindowComponent);
        when(windowComponent.showQuickPick(
            [{
                label: 'Global',
                value: true
            }, {
                label: 'Workspace',
                value: false
            }],
            {placeHolder: 'Select which scope of settings to save highlights to'}
        )).thenResolve(some({label: 'Global', value: true}));

        const picker = new ConfigTargetPicker(windowComponent);

        assert.deepEqual(await picker.pick(), some(true));
    });

    test('it returns none if user didn\'t select anything', async () => {
        const windowComponent = mock(WindowComponent);
        when(windowComponent.showQuickPick(any(), any())).thenReturn(none);
        const picker = new ConfigTargetPicker(windowComponent);

        assert.deepEqual(await picker.pick(), none);
    });

});
