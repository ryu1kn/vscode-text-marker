
const PatternFactory = require('../../lib/pattern-factory');

suite('PatternFactory', () => {

    test('it returns list of Range s which locates all the strings equal to the given text', () => {
        const patternFactory = new PatternFactory();
        const pattern = patternFactory.create({
            type: 'String',
            phrase: 'LONG'
        });
        const ranges = pattern.locateIn('ENTIRE LONG LONG TEXT');
        expect(ranges).to.eql([
            {startOffset: 7, endOffset: 11},
            {startOffset: 12, endOffset: 16}
        ]);
    });

    test('it returns list of Range s which locates all the strings match the given regex', () => {
        const patternFactory = new PatternFactory();
        const pattern = patternFactory.create({
            type: 'RegExp',
            phrase: 'Z+'
        });
        const ranges = pattern.locateIn('ENTIRE TEXT Z ZZ');
        expect(ranges).to.eql([
            {startOffset: 12, endOffset: 13},
            {startOffset: 14, endOffset: 16}
        ]);
    });

    test('it returns list of Range s which locates all the strings match the given regex if ignore case', () => {
        const patternFactory = new PatternFactory();
        const pattern = patternFactory.create({
            type: 'RegExp',
            phrase: 'Z+',
            ignoreCase: true
        });
        const ranges = pattern.locateIn('ENTIRE TEXT z ZZ');
        expect(ranges).to.eql([
            {startOffset: 12, endOffset: 13},
            {startOffset: 14, endOffset: 16}
        ]);
    });

    test('it finds Range s which locates all the strings equal to the given text', () => {
        const patternFactory = new PatternFactory();
        const pattern = patternFactory.create({
            type: 'String',
            phrase: 'TEXT'
        });
        const ranges = pattern.locateIn('ENTIRE TEXT text');
        expect(ranges).to.eql([
            {startOffset: 7, endOffset: 11}
        ]);
    });

    test('it returns list of Range s which locates all the strings match the given text if ignore case', () => {
        const patternFactory = new PatternFactory();
        const pattern = patternFactory.create({
            type: 'String',
            phrase: 'text',
            ignoreCase: true
        });
        const ranges = pattern.locateIn('ENTIRE TEXT text');
        expect(ranges).to.eql([
            {startOffset: 7, endOffset: 11},
            {startOffset: 12, endOffset: 16}
        ]);
    });

    test('it does not convert text expression into regex', () => {
        const patternFactory = new PatternFactory();
        const pattern = patternFactory.create({
            type: 'String',
            phrase: 'Z+'
        });
        const ranges = pattern.locateIn('ENTIRE TEXT Z+ ZZ');
        expect(ranges).to.eql([
            {startOffset: 12, endOffset: 14}
        ]);
    });

    test('it does not get stuck with matching an empty string match', () => {
        const patternFactory = new PatternFactory();
        const pattern = patternFactory.create({
            type: 'RegExp',
            phrase: '.*'
        });
        const ranges = pattern.locateIn('ENTIRE\n\nTEXT');
        expect(ranges).to.eql([
            {startOffset: 0, endOffset: 6},
            {startOffset: 8, endOffset: 12}
        ]);
    });

});
