import RegexPattern from '../../../lib/patterns/regex';
import StringPattern from '../../../lib/patterns/string';
import * as assert from 'assert';

suite('RegexPattern', () => {

    test('it returns list of ranges which locates all the strings match the given regex', () => {
        const pattern = new RegexPattern({
            phrase: 'Z+'
        });
        const ranges = pattern.locateIn('ENTIRE TEXT Z ZZ');
        assert.deepEqual(ranges, [
            {start: 12, end: 13},
            {start: 14, end: 16}
        ]);
    });

    test('it returns list of ranges which locates all the strings match the given regex if ignore case', () => {
        const pattern = new RegexPattern({
            phrase: 'Z+',
            ignoreCase: true
        });
        const ranges = pattern.locateIn('ENTIRE TEXT z ZZ');
        assert.deepEqual(ranges, [
            {start: 12, end: 13},
            {start: 14, end: 16}
        ]);
    });

    test('it finds all matches with whole word search', () => {
        const pattern = new RegexPattern({
            phrase: 'text',
            wholeMatch: true
        });
        const ranges = pattern.locateIn('ENTIRE texta text');
        assert.deepEqual(ranges, [
            {start: 13, end: 17}
        ]);
    });

    test('it finds all matches with whole word search - edge of the whole text', () => {
        const pattern = new RegexPattern({
            phrase: 'text',
            wholeMatch: true
        });
        const ranges = pattern.locateIn('text text');
        assert.deepEqual(ranges, [
            {start: 0, end: 4},
            {start: 5, end: 9}
        ]);
    });

    test('it finds all matches with whole word search - edge of the whole text', () => {
        const pattern = new RegexPattern({
            phrase: 'text',
            wholeMatch: true
        });
        const ranges = pattern.locateIn('text text');
        assert.deepEqual(ranges, [
            {start: 0, end: 4},
            {start: 5, end: 9}
        ]);
    });

    test('it finds all matches with whole word search - contains no word character at their edges', () => {
        const pattern = new RegexPattern({
            phrase: '-text',
            wholeMatch: true
        });
        const ranges = pattern.locateIn('a-text -textb --text-');
        assert.deepEqual(ranges, [
            {start: 1, end: 6},
            {start: 15, end: 20}
        ]);
    });

    test('it does not get stuck with matching an empty string match', () => {
        const pattern = new RegexPattern({
            phrase: '.*'
        });
        const ranges = pattern.locateIn('ENTIRE\n\nTEXT');
        assert.deepEqual(ranges, [
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
        assert.equal(pattern1.equalTo(pattern2), true);
    });

    test('it recognise the equality including case sensitivity', () => {
        const pattern1 = new RegexPattern({
            phrase: 'PHRASE'
        });
        const pattern2 = new RegexPattern({
            phrase: 'PHRASE',
            ignoreCase: true
        });
        assert.equal(pattern1.equalTo(pattern2), false);
    });

    test('it recognise the equality including whether whole match is on/off', () => {
        const pattern1 = new RegexPattern({
            phrase: 'PHRASE'
        });
        const pattern2 = new RegexPattern({
            phrase: 'PHRASE',
            wholeMatch: true
        });
        assert.equal(pattern1.equalTo(pattern2), false);
    });

    test('it recognises the equality including the pattern type', () => {
        const pattern1 = new RegexPattern({
            phrase: 'PHRASE'
        });
        const pattern2 = new StringPattern({
            phrase: 'PHRASE'
        });
        assert.equal(pattern1.equalTo(pattern2), false);
    });

    test('it toggles case sensitivity', () => {
        const pattern1 = new RegexPattern({
            phrase: 'PHRASE'
        });
        const pattern2 = pattern1.toggleCaseSensitivity();
        assert.equal(pattern1.equalTo(pattern2), false);
    });

    test('it toggles partial/whole match', () => {
        const pattern1 = new RegexPattern({
            phrase: 'PHRASE',
            wholeMatch: true
        });
        const pattern2 = pattern1.toggleWholeMatch();
        assert.equal(pattern1.equalTo(pattern2), false);
    });

});
