
const ColourRegistry = require('../../lib/colour-registry');

suite('ColourRegistry', () => {

    test('it returns a color which has not been used', () => {
        const workspace = {
            getConfiguration: stubWithArgs(['textmarker.colorList'], ['COLOUR_1'])
        };
        const colourRegistry = new ColourRegistry({workspace});
        expect(colourRegistry.issue()).to.eql('COLOUR_1');
    });

    test('it releases the given colour and make it available', () => {
        const workspace = {
            getConfiguration: stubWithArgs(['textmarker.colorList'], ['COLOUR_1'])
        };
        const colourRegistry = new ColourRegistry({workspace});

        colourRegistry.issue();
        colourRegistry.revoke('COLOUR_1');

        expect(colourRegistry.issue()).to.eql('COLOUR_1');
    });
});
