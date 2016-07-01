
const DecorationRegistry = require('../../lib/decoration-registry');

suite('DecorationRegistry', () => {

    test('it returns a registered decoration type for the passed string', () => {
        const window = {createTextEditorDecorationType: () => 'DECORATION_TYPE'};
        const registry = new DecorationRegistry({window});
        registry.issue('TEXT');
        expect(registry.inquire('TEXT')).to.eql('DECORATION_TYPE');
    });

    test("it can remove given text and it's associated decoration type from the registry", () => {
        const window = {createTextEditorDecorationType: () => 'DECORATION_TYPE'};
        const registry = new DecorationRegistry({window});
        registry.issue('TEXT');
        registry.revoke('TEXT');
        expect(registry.inquire('TEXT')).to.be.null;
    });
});
