
const TextLocator = require('../../lib/text-locator');
const PatternFactory = require('../../lib/pattern-factory');

suite('TextLocator', () => {

    test('it returns list of Range s which locates all the strings equal to the given text', () => {
        const textLocator = new TextLocator({Range: fakeRange});
        const pattern = new PatternFactory().create({
            type: 'String',
            pattern: 'LONG',
            caseSensitive: true
        });
        const ranges = textLocator.locate(fakeEditor('ENTIRE LONG LONG TEXT'), pattern);
        expect(ranges).to.eql([
            {start: 'POSITION:7', end: 'POSITION:11'},
            {start: 'POSITION:12', end: 'POSITION:16'}
        ]);
    });

    function fakeEditor(entireText) {
        return {
            document: {
                getText: () => entireText,
                positionAt: offset => `POSITION:${offset}`
            }
        };
    }

    function fakeRange(position1, position2) {
        return {start: position1, end: position2};
    }

});
