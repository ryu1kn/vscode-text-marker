import {mock, mockType, when} from '../helpers/mock';

import RegexReader from '../../lib/regex-reader';
import WindowComponent from '../../lib/editor-components/window';
import RegexPattern from '../../lib/patterns/regex';
import MatchingModeRegistry from '../../lib/matching-mode-registry';
import * as assert from 'assert';
import {some} from '../../../node_modules/fp-ts/lib/Option';

suite('RegexReader', () => {

    const matchingModeRegistry = mockType<MatchingModeRegistry>();

    const windowComponent = mock(WindowComponent);
    when(windowComponent.showInputBox({placeHolder: 'Enter a regular expression to highlight text'}))
        .thenResolve(some('PATTERN_STRING'));

    const reader = new RegexReader(matchingModeRegistry, windowComponent);

    test('shows inputBox to let user enter regex', async () => {
        assert.deepEqual(await reader.read(), some(new RegexPattern({phrase: 'PATTERN_STRING'})));
    });

});
