
const ColourRegistry = require('../../lib/colour-registry');

suite('ColourRegistry', () => {

    test('it returns a color which has not been used', () => {
        const configStore = {get: stubWithArgs(['highlightColors'], ['COLOUR_1'])};
        const colourRegistry = new ColourRegistry({configStore});
        expect(colourRegistry.issue()).to.eql('COLOUR_1');
    });

    test('it releases the given colour and make it available', () => {
        const configStore = {get: stubWithArgs(['highlightColors'], ['COLOUR_1'])};
        const colourRegistry = new ColourRegistry({configStore});

        colourRegistry.issue();
        colourRegistry.revoke('COLOUR_1');

        expect(colourRegistry.issue()).to.eql('COLOUR_1');
    });

    test('it issues "gray" if it already used all the colours given in the settings', () => {
        const configStore = {get: stubWithArgs(['highlightColors'], [])};
        const colourRegistry = new ColourRegistry({configStore});
        expect(colourRegistry.issue()).to.eql('gray');
    });
});
