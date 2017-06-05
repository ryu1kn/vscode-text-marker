
const TextLocationRegistry = require('../../lib/text-location-registry');

suite('TextLocationRegistry', () => {

    test('it queries decoration id at given position', () => {
        const registry = createRegistry();
        const decorationId = registry.queryDecorationId({editorId: 'EDITOR_ID', offset: 1});
        expect(decorationId).to.eql('DECORATION_ID');
    });

    test('it returns null if no decoration ids are registered yet', () => {
        const registry = new TextLocationRegistry();
        const decorationId = registry.queryDecorationId({editorId: 'EDITOR_ID', offset: 5});
        expect(decorationId).to.be.null;
    });

    test('it returns null if decoration is not found', () => {
        const registry = createRegistry();
        const decorationId = registry.queryDecorationId({editorId: 'EDITOR_ID', offset: 5});
        expect(decorationId).to.be.null;
    });

    test('it deregisters a decoration id and their positions', () => {
        const registry = createRegistry();
        const decorationId = registry.queryDecorationId({editorId: 'EDITOR_ID', offset: 1});
        expect(decorationId).to.eql('DECORATION_ID');
        registry.deregister(decorationId);
        const decorationId2 = registry.queryDecorationId({editorId: 'EDITOR_ID', offset: 1});
        expect(decorationId2).to.be.null;
    });

    function createRegistry() {
        const registry = new TextLocationRegistry();
        registry.register({
            editorId: 'EDITOR_ID',
            decorationId: 'DECORATION_ID',
            ranges: [{start: 0, end: 3}]
        });
        return registry;
    }

});
