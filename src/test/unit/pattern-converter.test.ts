import {PatternAction} from '../../lib/const';
import PatternConverter from '../../lib/pattern-converter';
import StringPattern from '../../lib/patterns/string';
import * as assert from 'assert';

suite('PatternConverter', () => {

    test('it toggles the case sensitivity of given pattern', () => {
        const converter = new PatternConverter();
        const pattern = new StringPattern({phrase: 'text'});
        assert.equal(pattern.ignoreCase, false);

        const pattern2 = converter.convert(pattern, PatternAction.TOGGLE_CASE_SENSITIVITY);
        assert.equal(pattern2.ignoreCase, true);
    });

    test('it toggles the partial/whole match of given pattern', () => {
        const converter = new PatternConverter();
        const pattern = new StringPattern({phrase: 'text'});
        assert.equal(pattern.wholeMatch, false);

        const pattern2 = converter.convert(pattern, PatternAction.TOGGLE_WHOLE_MATCH);
        assert.equal(pattern2.wholeMatch, true);
    });

    test('it throws an error given unknown convert instruction', () => {
        const converter = new PatternConverter();
        const pattern = new StringPattern({phrase: 'text'});
        const convertAction = PatternAction.UPDATE_PHRASE;
        const callback = () => converter.convert(pattern, convertAction);
        assert.throws(callback, /Unknown action update-phrase/);
    });

});
