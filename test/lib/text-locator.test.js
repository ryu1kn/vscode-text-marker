
const TextLocator = require('../../lib/text-locator');

suite('TextLocator', () => {

    test('it returns list of Range s which locates all the strings equal to the given text', () => {
        const textLocator = new TextLocator({Range: fakeRange});
        const pattern = {
            type: 'String',
            value: 'LONG',
            ignoreCase: false
        };
        const ranges = textLocator.locate(fakeEditor('ENTIRE LONG LONG TEXT'), pattern);
        expect(ranges).to.eql([
            {start: 'POSITION:7', end: 'POSITION:11'},
            {start: 'POSITION:12', end: 'POSITION:16'}
        ]);
    });

    test('it returns list of Range s which locates all the strings match the given regex', () => {
        const textLocator = new TextLocator({Range: fakeRange});
        const pattern = {
            type: 'RegExp',
            value: 'Z+',
            ignoreCase: false
        };
        const ranges = textLocator.locate(fakeEditor('ENTIRE TEXT Z ZZ'), pattern);
        expect(ranges).to.eql([
            {start: 'POSITION:12', end: 'POSITION:13'},
            {start: 'POSITION:14', end: 'POSITION:16'}
        ]);
    });

    test('it returns list of Range s which locates all the strings match the given regex if ignore case', () => {
        const textLocator = new TextLocator({Range: fakeRange});
        const pattern = {
            type: 'RegExp',
            value: 'Z+',
            ignoreCase: true
        };
        const ranges = textLocator.locate(fakeEditor('ENTIRE TEXT z ZZ'), pattern);
        expect(ranges).to.eql([
            {start: 'POSITION:12', end: 'POSITION:13'},
            {start: 'POSITION:14', end: 'POSITION:16'}
        ]);
    });

    test('it finds Range s which locates all the strings equal to the given text', () => {
        const textLocator = new TextLocator({Range: fakeRange});
        const pattern = {
            type: 'String',
            value: 'TEXT',
            ignoreCase: false
        };
        const ranges = textLocator.locate(fakeEditor('ENTIRE TEXT text'), pattern);
        expect(ranges).to.eql([
            {start: 'POSITION:7', end: 'POSITION:11'}
        ]);
    });

    test('it returns list of Range s which locates all the strings match the given text if ignore case', () => {
        const textLocator = new TextLocator({Range: fakeRange});
        const pattern = {
            type: 'String',
            value: 'text',
            ignoreCase: true
        };
        const ranges = textLocator.locate(fakeEditor('ENTIRE TEXT text'), pattern);
        expect(ranges).to.eql([
            {start: 'POSITION:7', end: 'POSITION:11'},
            {start: 'POSITION:12', end: 'POSITION:16'}
        ]);
    });

    test('it does not convert text expression into regex', () => {
        const textLocator = new TextLocator({Range: fakeRange});
        const pattern = {
            type: 'String',
            value: 'Z+',
            ignoreCase: false
        };
        const ranges = textLocator.locate(fakeEditor('ENTIRE TEXT Z+ ZZ'), pattern);
        expect(ranges).to.eql([
            {start: 'POSITION:12', end: 'POSITION:14'}
        ]);
    });

    test('it does not get stuck with matching an empty string match', () => {
        const textLocator = new TextLocator({Range: fakeRange});
        const pattern = {
            type: 'RegExp',
            value: '.*',
            ignoreCase: false
        };
        const ranges = textLocator.locate(fakeEditor('ENTIRE\n\nTEXT'), pattern);
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

    function fakeRange(position1, position2) {
        return {start: position1, end: position2};
    }

});
