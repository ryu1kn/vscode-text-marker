
const TextLocator = require('../../lib/text-locator');

suite('TextLocator', () => {

    test('it returns list of Range s which locates all the strings equals to the given text', () => {
        const Range = function (position1, position2) {
            return {start: position1, end: position2};
        };
        const textLocator = new TextLocator({Range});
        const ranges = textLocator.locate(fakeEditor('ENTIRE_TEXT'), 'TEXT');
        expect(ranges).to.eql([
            {start: 'POSITION:7', end: 'POSITION:11'}
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

});
