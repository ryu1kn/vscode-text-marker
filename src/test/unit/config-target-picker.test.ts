import {expect, stubWithArgs} from '../helpers/helper';

import ConfigTargetPicker from '../../lib/config-target-picker';

suite('ConfigTargetPicker', () => {

    test('it lets user to select which level they want to save a config', async () => {
        const windowComponent = {showQuickPick: stubWithArgs(
            [
                [{
                    label: 'Global',
                    value: true,
                    description: null
                }, {
                    label: 'Workspace',
                    value: false,
                    description: null
                }],
                {placeHolder: 'Select which scope of settings to save highlights to'}
            ],
            Promise.resolve({label: 'Global', value: true})
        )};
        const picker = new ConfigTargetPicker(windowComponent);

        expect(await picker.pick()).to.eql(true);
    });

    test('it returns null if user didn\'t select anything', async () => {
        const windowComponent = {showQuickPick: () => {}};
        const picker = new ConfigTargetPicker(windowComponent);

        expect(await picker.pick()).to.eql(null);
    });

});
