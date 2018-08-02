import {expect} from '../helpers/helper';

import TextLocationRegistry from '../../lib/text-location-registry';

suite('TextLocationRegistry', () => {

    let registry: TextLocationRegistry;

    setup(() => {
        registry = new TextLocationRegistry();
        registry.register('EDITOR_ID', 'DECORATION_ID', [range(0, 3)]);
    });

    test('treat the exact same range decoration the same decoration', () => {
        const decorationId = registry.queryDecorationId('EDITOR_ID', range(0, 3));
        expect(decorationId).to.eql('DECORATION_ID');
    });

    test('treat the included single point the same decoration', () => {
        const decorationId = registry.queryDecorationId('EDITOR_ID', range(1, 1));
        expect(decorationId).to.eql('DECORATION_ID');
    });

    test('does not treat sub-ranged decoration the same decoration', () => {
        const decorationId = registry.queryDecorationId('EDITOR_ID', range(1, 2));
        expect(decorationId).to.be.null;
    });

    test('it returns null if no decoration ids are registered yet', () => {
        const registry = new TextLocationRegistry();
        const decorationId = registry.queryDecorationId('EDITOR_ID', range(1, 1));
        expect(decorationId).to.be.null;
    });

    test('it returns null if decoration is not found', () => {
        const decorationId = registry.queryDecorationId('EDITOR_ID', range(5, 5));
        expect(decorationId).to.be.null;
    });

    test('it deregisters a decoration id and their positions', () => {
        const decorationId = registry.queryDecorationId('EDITOR_ID', range(1, 1));
        expect(decorationId).to.eql('DECORATION_ID');
        registry.deregister(decorationId!);
        const decorationId2 = registry.queryDecorationId('EDITOR_ID', range(1, 1));
        expect(decorationId2).to.be.null;
    });

    function range(start: number, end: number) {
        return {start, end};
    }
});
