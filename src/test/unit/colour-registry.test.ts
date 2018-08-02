import {expect, mockType} from '../helpers/helper';

import ColourRegistry from '../../lib/colour-registry';
import ConfigStore from "../../lib/config-store";

suite('ColourRegistry', () => {

    suite('When at least 1 colour is registered', () => {
        let configStore;
        let colourRegistry: ColourRegistry;

        setup(() => {
            configStore = {highlightColors: ['COLOUR_1']} as ConfigStore;
            colourRegistry = new ColourRegistry(configStore);
        });

        test('it returns a color which has not been used', () => {
            expect(colourRegistry.issue()).to.eql('COLOUR_1');
        });

        test('it releases the given colour and make it available', () => {
            colourRegistry.issue();
            colourRegistry.revoke('COLOUR_1');

            expect(colourRegistry.issue()).to.eql('COLOUR_1');
        });
    })

    suite('When no colours are left unused', () => {
        const configStore = mockType<ConfigStore>({
            highlightColors: [],
            defaultHighlightColor: 'DEFAULT_COLOUR'
        });
        const colourRegistry = new ColourRegistry(configStore);

        test('it issues the user specified default colour', () => {
            expect(colourRegistry.issue()).to.eql('DEFAULT_COLOUR');
        });
    });
});
