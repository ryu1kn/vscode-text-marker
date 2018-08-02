import {expect, mockType} from '../helpers/helper';

import PatternFactory from '../../lib/pattern-factory';
import StringPattern from '../../lib/patterns/string';
import RegexPattern from '../../lib/patterns/regex';
import MatchingModeRegistry from "../../lib/matching-mode-registry";

suite('PatternFactory', () => {

    test('it creates a string pattern', () => {
        const patternFactory = new PatternFactory(fakeMatchingModeRegistry());
        const pattern = patternFactory.create({
            phrase: 'PHRASE'
        });
        expect(pattern).to.be.instanceof(StringPattern);
        expect(pattern.ignoreCase).to.be.false;
    });

    test('it creates a regex pattern', () => {
        const patternFactory = new PatternFactory(fakeMatchingModeRegistry());
        const pattern = patternFactory.create({
            type: 'RegExp',
            phrase: 'PHRASE'
        });
        expect(pattern).to.be.instanceof(RegexPattern);
    });

    test('it uses the current matching mode', () => {
        const patternFactory = new PatternFactory(fakeMatchingModeRegistry(true));
        const pattern = patternFactory.create({
            phrase: 'PHRASE'
        });
        expect(pattern.ignoreCase).to.be.true;
    });

    test('it honours the specified matching mode rather than current mode', () => {
        const patternFactory = new PatternFactory(fakeMatchingModeRegistry(true));
        const pattern = patternFactory.create({
            phrase: 'PHRASE',
            ignoreCase: false
        });
        expect(pattern.ignoreCase).to.be.false;
    });

    function fakeMatchingModeRegistry(ignoreCase = false) {
        return mockType<MatchingModeRegistry>({mode: {ignoreCase}});
    }
});
