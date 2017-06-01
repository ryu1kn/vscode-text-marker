
const PatternFactory = require('../../../lib/pattern-factory');

suite('StringPattern', () => {

    test('it returns list of Range s which locates all the strings equal to the given text', () => {
        const patternFactory = new PatternFactory();
        const pattern = patternFactory.create({
            type: 'String',
            phrase: 'LONG'
        });
        const ranges = pattern.locateIn('ENTIRE LONG LONG TEXT');
        expect(ranges).to.eql([
            {start: 7, end: 11},
            {start: 12, end: 16}
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
            {start: 7, end: 11}
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
            {start: 7, end: 11},
            {start: 12, end: 16}
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
            {start: 12, end: 14}
        ]);
    });

    test('it recognise the same pattern', () => {
        const patternFactory = new PatternFactory();
        const pattern1 = patternFactory.create({
            phrase: 'PHRASE'
        });
        const pattern2 = patternFactory.create({
            phrase: 'PHRASE',
            ignoreCase: false
        });
        expect(pattern1.equalTo(pattern2)).to.be.true;
    });

    test('it recognise the equality including case sensitivity', () => {
        const patternFactory = new PatternFactory();
        const pattern1 = patternFactory.create({
            phrase: 'PHRASE'
        });
        const pattern2 = patternFactory.create({
            phrase: 'PHRASE',
            ignoreCase: true
        });
        expect(pattern1.equalTo(pattern2)).to.be.false;
    });

    test('it recognise the equality including the pattern type', () => {
        const patternFactory = new PatternFactory();
        const pattern1 = patternFactory.create({
            type: 'RegExp',
            phrase: 'PHRASE'
        });
        const pattern2 = patternFactory.create({
            type: 'String',
            phrase: 'PHRASE'
        });
        expect(pattern1.equalTo(pattern2)).to.be.false;
    });

    test('it toggles case sensitivity', () => {
        const patternFactory = new PatternFactory();
        const pattern1 = patternFactory.create({
            phrase: 'PHRASE'
        });
        const pattern2 = pattern1.toggleCaseSensitivity();
        expect(pattern1.equalTo(pattern2)).to.be.false;
    });

});
