
const TextLocator = require('../../lib/text-locator');

suite('TextLocator', () => {

    test('it returns list of Range s which locates all the strings equal to the given text', () => {
        const Range = function (position1, position2) {
            return {start: position1, end: position2};
        };
        const textLocator = new TextLocator({Range});
        const ranges = textLocator.locate(fakeEditor('ENTIRE LONG LONG TEXT'), 'LONG');
        expect(ranges).to.eql([
            {start: 'POSITION:7', end: 'POSITION:11'},
            {start: 'POSITION:12', end: 'POSITION:16'}
        ]);
    });

    test('it returns list of Range s which locates all the strings match the given regex', () => {
        const Range = function (position1, position2) {
            return {start: position1, end: position2};
        };
        const textLocator = new TextLocator({Range});
        const ranges = textLocator.locate(fakeEditor('ENTIRE TEXT Z ZZ'), /Z+/);
        expect(ranges).to.eql([
            {start: 'POSITION:12', end: 'POSITION:13'},
            {start: 'POSITION:14', end: 'POSITION:16'}
        ]);
    });

    test('it also works when the given regex has `g` flag set', () => {
        const Range = function (position1, position2) {
            return {start: position1, end: position2};
        };
        const textLocator = new TextLocator({Range});
        const ranges = textLocator.locate(fakeEditor('ENTIRE TEXT Z ZZ'), /Z+/gi);
        expect(ranges).to.eql([
            {start: 'POSITION:12', end: 'POSITION:13'},
            {start: 'POSITION:14', end: 'POSITION:16'}
        ]);
    });

    test('it does not convert text expression into regex', () => {
        const Range = function (position1, position2) {
            return {start: position1, end: position2};
        };
        const textLocator = new TextLocator({Range});
        const ranges = textLocator.locate(fakeEditor('ENTIRE TEXT Z+ ZZ'), 'Z+');
        expect(ranges).to.eql([
            {start: 'POSITION:12', end: 'POSITION:14'}
        ]);
    });

    test('it does not get stuck with matching an empty string match', () => {
        const Range = function (position1, position2) {
            return {start: position1, end: position2};
        };
        const textLocator = new TextLocator({Range});
        const ranges = textLocator.locate(fakeEditor('ENTIRE\n\nTEXT'), /.*/);
        expect(ranges).to.eql([
            {start: 'POSITION:0', end: 'POSITION:6'},
            {start: 'POSITION:8', end: 'POSITION:12'}
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
