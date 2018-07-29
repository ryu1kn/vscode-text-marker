import {expect} from '../helpers/helper';
import {PatternAction} from '../../lib/const';
import PatternConverter from '../../lib/pattern-converter';
import StringPattern from '../../lib/patterns/string';

suite('PatternConverter', () => {

    test('it toggles the case sensitivity of given pattern', () => {
        const converter = new PatternConverter();
        const pattern = new StringPattern({phrase: 'text'});
        expect(pattern.ignoreCase).to.be.false;

        const pattern2 = converter.convert(pattern, PatternAction.TOGGLE_CASE_SENSITIVITY);
        expect(pattern2.ignoreCase).to.be.true;
    });

    test('it toggles the partial/whole match of given pattern', () => {
        const converter = new PatternConverter();
        const pattern = new StringPattern({phrase: 'text'});
        expect(pattern.wholeMatch).to.be.false;

        const pattern2 = converter.convert(pattern, PatternAction.TOGGLE_WHOLE_MATCH);
        expect(pattern2.wholeMatch).to.be.true;
    });

    test('it throws an error given unknown convert instruction', () => {
        const converter = new PatternConverter();
        const pattern = new StringPattern({phrase: 'text'});
        const callback = () => converter.convert(pattern, 'UNKNOWN_CONVERSION');
        expect(callback).to.throws('Unknown action UNKNOWN_CONVERSION');
    });

});
