import RegexPattern from '../../../lib/pattern/regex';
import StringPattern from '../../../lib/pattern/string';
import * as assert from 'assert';

suite('StringPattern', () => {

    test('it returns list of ranges which locates all the strings equal to the given text', () => {
        const pattern = new StringPattern({
            phrase: 'LONG'
        });
        const ranges = pattern.locateIn('ENTIRE LONG LONG TEXT');
        assert.deepEqual(ranges, [
            {start: 7, end: 11},
            {start: 12, end: 16}
        ]);
    });

    test('it finds ranges which locates all the strings equal to the given text', () => {
        const pattern = new StringPattern({
            phrase: 'TEXT'
        });
        const ranges = pattern.locateIn('ENTIRE TEXT text');
        assert.deepEqual(ranges, [
            {start: 7, end: 11}
        ]);
    });

    test('it returns list of ranges which locates all the strings match the given text if ignore case', () => {
        const pattern = new StringPattern({
            phrase: 'text',
            ignoreCase: true
        });
        const ranges = pattern.locateIn('ENTIRE TEXT text');
        assert.deepEqual(ranges, [
            {start: 7, end: 11},
            {start: 12, end: 16}
        ]);
    });

    test('it finds all matches with whole word search', () => {
        const pattern = new StringPattern({
            phrase: 'text',
            wholeMatch: true
        });
        const ranges = pattern.locateIn('ENTIRE texta text');
        assert.deepEqual(ranges, [
            {start: 13, end: 17}
        ]);
    });

    test('it finds all matches with whole word search - edge of the whole text', () => {
        const pattern = new StringPattern({
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
        const pattern = new StringPattern({
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
        const pattern = new StringPattern({
            phrase: '-text',
            wholeMatch: true
        });
        const ranges = pattern.locateIn('a-text -textb --text-');
        assert.deepEqual(ranges, [
            {start: 1, end: 6},
            {start: 15, end: 20}
        ]);
    });

    test('it does not convert text expression into regex', () => {
        const pattern = new StringPattern({
            phrase: 'Z+'
        });
        const ranges = pattern.locateIn('ENTIRE TEXT Z+ ZZ');
        assert.deepEqual(ranges, [
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
        assert.equal(pattern1.equalTo(pattern2), true);
    });

    test('it recognise the equality including case sensitivity', () => {
        const pattern1 = new StringPattern({
            phrase: 'PHRASE'
        });
        const pattern2 = new StringPattern({
            phrase: 'PHRASE',
            ignoreCase: true
        });
        assert.equal(pattern1.equalTo(pattern2), false);
    });

    test('it recognise the equality including whether whole match is on/off', () => {
        const pattern1 = new StringPattern({
            phrase: 'PHRASE'
        });
        const pattern2 = new StringPattern({
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
        const pattern1 = new StringPattern({
            phrase: 'PHRASE'
        });
        const pattern2 = pattern1.toggleCaseSensitivity();
        assert.equal(pattern1.equalTo(pattern2), false);
    });

    test('it toggles partial/whole match', () => {
        const pattern1 = new StringPattern({
            phrase: 'PHRASE',
            wholeMatch: true
        });
        const pattern2 = pattern1.toggleWholeMatch();
        assert.equal(pattern1.equalTo(pattern2), false);
    });

});
