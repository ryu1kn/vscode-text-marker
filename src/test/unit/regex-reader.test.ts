import {expect, mock, when} from '../helpers/helper';

import RegexReader from '../../lib/regex-reader';
import PatternFactory from '../../lib/pattern-factory';
import WindowComponent from '../../lib/editor-components/window';
import RegexPattern from '../../lib/patterns/regex';

suite('RegexReader', () => {

    test('shows inputBox to let user enter regex', async () => {
        const pattern = mock(RegexPattern);
        const patternFactory = mock(PatternFactory);
        when(patternFactory.create({type: 'RegExp', phrase: 'PATTERN_STRING'})).thenReturn(pattern);
        const windowComponent = mock(WindowComponent);
        when(windowComponent.showInputBox({placeHolder: 'Enter a regular expression to highlight text'})).thenResolve('PATTERN_STRING');
        const reader = new RegexReader(patternFactory, windowComponent);

        expect(await reader.read()).to.eql(pattern);
    });

});
