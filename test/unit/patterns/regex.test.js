
const RegexPattern = require('../../../lib/patterns/regex');
const StringPattern = require('../../../lib/patterns/string');

suite('RegexPattern', () => {

    test('it returns list of Range s which locates all the strings match the given regex', () => {
        const pattern = new RegexPattern({
            phrase: 'Z+'
        });
        const ranges = pattern.locateIn('ENTIRE TEXT Z ZZ');
        expect(ranges).to.eql([
            {start: 12, end: 13},
            {start: 14, end: 16}
        ]);
    });

    test('it returns list of Range s which locates all the strings match the given regex if ignore case', () => {
        const pattern = new RegexPattern({
            phrase: 'Z+',
            ignoreCase: true
        });
        const ranges = pattern.locateIn('ENTIRE TEXT z ZZ');
        expect(ranges).to.eql([
            {start: 12, end: 13},
            {start: 14, end: 16}
        ]);
    });

    test('it does not get stuck with matching an empty string match', () => {
        const pattern = new RegexPattern({
            phrase: '.*'
        });
        const ranges = pattern.locateIn('ENTIRE\n\nTEXT');
        expect(ranges).to.eql([
            {start: 0, end: 6},
            {start: 8, end: 12}
        ]);
    });

    test('it recognise the same pattern', () => {
        const pattern1 = new RegexPattern({
            phrase: 'PHRASE'
        });
        const pattern2 = new RegexPattern({
            phrase: 'PHRASE',
            ignoreCase: false
        });
        expect(pattern1.equalTo(pattern2)).to.be.true;
    });

    test('it recognise the equality including case sensitivity', () => {
        const pattern1 = new RegexPattern({
            phrase: 'PHRASE'
        });
        const pattern2 = new RegexPattern({
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
        const pattern1 = new RegexPattern({
            type: 'RegExp',
            phrase: 'PHRASE'
        });
        const pattern2 = pattern1.toggleCaseSensitivity();
        expect(pattern1.equalTo(pattern2)).to.be.false;
    });

});
