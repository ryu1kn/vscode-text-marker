
const PatternFactory = require('../../../lib/pattern-factory');

suite('RegexPattern', () => {

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

    test('it recognise the same pattern', () => {
        const patternFactory = new PatternFactory();
        const pattern1 = patternFactory.create({
            type: 'RegExp',
            phrase: 'PHRASE'
        });
        const pattern2 = patternFactory.create({
            type: 'RegExp',
            phrase: 'PHRASE',
            ignoreCase: false
        });
        expect(pattern1.equalTo(pattern2)).to.be.true;
    });

    test('it recognise the equality including case sensitivity', () => {
        const patternFactory = new PatternFactory();
        const pattern1 = patternFactory.create({
            type: 'RegExp',
            phrase: 'PHRASE'
        });
        const pattern2 = patternFactory.create({
            type: 'RegExp',
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
            type: 'RegExp',
            phrase: 'PHRASE'
        });
        const pattern2 = pattern1.toggleCaseSensitivity();
        expect(pattern1.equalTo(pattern2)).to.be.false;
    });

});
