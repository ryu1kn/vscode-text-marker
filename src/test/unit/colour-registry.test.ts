import {mockType} from '../helpers/helper';

import ColourRegistry from '../../lib/colour-registry';
import ConfigStore from '../../lib/config-store';
import * as assert from 'assert';

suite('ColourRegistry', () => {

    suite('When at least 1 colour is registered', () => {
        let configStore;
        let colourRegistry: ColourRegistry;

        setup(() => {
            configStore = {highlightColors: ['COLOUR_1']} as ConfigStore;
            colourRegistry = new ColourRegistry(configStore);
        });

        test('it returns a color which has not been used', () => {
            assert.deepEqual(colourRegistry.issue(), 'COLOUR_1');
        });

        test('it releases the given colour and make it available', () => {
            colourRegistry.issue();
            colourRegistry.revoke('COLOUR_1');

            assert.deepEqual(colourRegistry.issue(), 'COLOUR_1');
        });
    });

    suite('When no colours are left unused', () => {
        const configStore = mockType<ConfigStore>({
            highlightColors: [],
            defaultHighlightColor: 'DEFAULT_COLOUR'
        });
        const colourRegistry = new ColourRegistry(configStore);

        test('it issues the user specified default colour', () => {
            assert.deepEqual(colourRegistry.issue(), 'DEFAULT_COLOUR');
        });
    });
});
