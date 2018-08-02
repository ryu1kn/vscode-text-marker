import {any, expect, mock, when} from '../helpers/helper';

import ConfigTargetPicker from '../../lib/config-target-picker';
import WindowComponent from '../../lib/editor-components/window';

suite('ConfigTargetPicker', () => {

    test('it lets user to select which level they want to save a config', async () => {
        const windowComponent = mock(WindowComponent);
        when(windowComponent.showQuickPick(
            [{
                label: 'Global',
                value: true,
                description: ''
            }, {
                label: 'Workspace',
                value: false,
                description: ''
            }],
            {placeHolder: 'Select which scope of settings to save highlights to'}
        )).thenResolve({label: 'Global', value: true});

        const picker = new ConfigTargetPicker(windowComponent);

        expect(await picker.pick()).to.eql(true);
    });

    test('it returns null if user didn\'t select anything', async () => {
        const windowComponent = mock(WindowComponent);
        when(windowComponent.showQuickPick(any(), any())).thenReturn();
        const picker = new ConfigTargetPicker(windowComponent);

        expect(await picker.pick()).to.eql(undefined);
    });

});
