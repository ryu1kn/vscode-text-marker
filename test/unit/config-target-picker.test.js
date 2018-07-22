const {expect, stubWithArgs} = require('../helpers/helper');

const ConfigTargetPicker = require('../../lib/config-target-picker');

suite('ConfigTargetPicker', () => {

    test('it lets user to select which level they want to save a config', async () => {
        const windowComponent = {showQuickPick: stubWithArgs(
            [
                [{
                    label: 'Global',
                    value: 1
                }, {
                    label: 'Workspace',
                    value: 2
                }],
                {placeHolder: 'Select which scope of settings to save highlights to'}
            ],
            Promise.resolve({label: 'Global', value: 1})
        )};
        const picker = new ConfigTargetPicker({windowComponent});

        expect(await picker.pick()).to.eql(1);
    });

    test('it returns null if user didn\'t select anything', async () => {
        const windowComponent = {showQuickPick: () => {}};
        const picker = new ConfigTargetPicker({windowComponent});

        expect(await picker.pick()).to.eql(null);
    });

});
