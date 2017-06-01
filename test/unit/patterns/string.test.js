
const RegexPattern = require('../../../lib/patterns/regex');
const StringPattern = require('../../../lib/patterns/string');

suite('StringPattern', () => {

    test('it returns list of Range s which locates all the strings equal to the given text', () => {
        const pattern = new StringPattern({
            phrase: 'LONG'
        });
        const ranges = pattern.locateIn('ENTIRE LONG LONG TEXT');
        expect(ranges).to.eql([
            {start: 7, end: 11},
            {start: 12, end: 16}
        ]);
    });

    test('it finds Range s which locates all the strings equal to the given text', () => {
        const pattern = new StringPattern({
            phrase: 'TEXT'
        });
        const ranges = pattern.locateIn('ENTIRE TEXT text');
        expect(ranges).to.eql([
            {start: 7, end: 11}
        ]);
    });

    test('it returns list of Range s which locates all the strings match the given text if ignore case', () => {
        const pattern = new StringPattern({
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
        const pattern = new StringPattern({
            phrase: 'Z+'
        });
        const ranges = pattern.locateIn('ENTIRE TEXT Z+ ZZ');
        expect(ranges).to.eql([
            {start: 12, end: 14}
        ]);
    });

    test('it recognise the same pattern', () => {
        const pattern1 = new StringPattern({
            phrase: 'PHRASE'
        });
        const pattern2 = new StringPattern({
            phrase: 'PHRASE',
            ignoreCase: false
        });
        expect(pattern1.equalTo(pattern2)).to.be.true;
    });

    test('it recognise the equality including case sensitivity', () => {
        const pattern1 = new StringPattern({
            phrase: 'PHRASE'
        });
        const pattern2 = new StringPattern({
            phrase: 'PHRASE',
            ignoreCase: true
        });
        expect(pattern1.equalTo(pattern2)).to.be.false;
    });

    test('it recognises the equality including the pattern type', () => {
        const pattern1 = new RegexPattern({
            phrase: 'PHRASE'
        });
        const pattern2 = new StringPattern({
            phrase: 'PHRASE'
        });
        expect(pattern1.equalTo(pattern2)).to.be.false;
    });

    test('it toggles case sensitivity', () => {
        const pattern1 = new StringPattern({
            phrase: 'PHRASE'
        });
        const pattern2 = pattern1.toggleCaseSensitivity();
        expect(pattern1.equalTo(pattern2)).to.be.false;
    });

});
