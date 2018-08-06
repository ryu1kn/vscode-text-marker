import {mockType} from '../helpers/mock';

import PatternFactory from '../../lib/pattern-factory';
import StringPattern from '../../lib/patterns/string';
import RegexPattern from '../../lib/patterns/regex';
import MatchingModeRegistry from '../../lib/matching-mode-registry';
import * as assert from 'assert';
import {assertInstanceOf} from '../helpers/assertions';

suite('PatternFactory', () => {

    test('it creates a string pattern', () => {
        const patternFactory = new PatternFactory(fakeMatchingModeRegistry());
        const pattern = patternFactory.create({
            phrase: 'PHRASE'
        });
        assertInstanceOf(pattern, StringPattern);
        assert.equal(pattern.ignoreCase, false);
    });

    test('it creates a regex pattern', () => {
        const patternFactory = new PatternFactory(fakeMatchingModeRegistry());
        const pattern = patternFactory.create({
            type: 'RegExp',
            phrase: 'PHRASE'
        });
        assertInstanceOf(pattern, RegexPattern);
    });

    test('it uses the current matching mode', () => {
        const patternFactory = new PatternFactory(fakeMatchingModeRegistry(true));
        const pattern = patternFactory.create({
            phrase: 'PHRASE'
        });
        assert.equal(pattern.ignoreCase, true);
    });

    test('it honours the specified matching mode rather than current mode', () => {
        const patternFactory = new PatternFactory(fakeMatchingModeRegistry(true));
        const pattern = patternFactory.create({
            phrase: 'PHRASE',
            ignoreCase: false
        });
        assert.equal(pattern.ignoreCase, false);
    });

    function fakeMatchingModeRegistry(ignoreCase = false) {
        return mockType<MatchingModeRegistry>({mode: {ignoreCase}});
    }
});
