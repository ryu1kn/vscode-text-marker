import {expect, sinon} from '../helpers/helper';

import RegexReader from '../../lib/regex-reader';

suite('RegexReader', () => {

    test('shows inputBox to let user enter regex', async () => {
        const patternFactory = {create: sinon.stub().returns('PATTERN')};
        const windowComponent = {
            showInputBox: sinon.stub().returns(Promise.resolve('PATTERN_STRING'))
        };
        const reader = new RegexReader({patternFactory, windowComponent});
        const pattern = await reader.read();

        expect(pattern).to.eql('PATTERN');
        expect(patternFactory.create).to.have.been.calledWith({
            type: 'RegExp',
            phrase: 'PATTERN_STRING'
        });
        expect(windowComponent.showInputBox).to.have.been.calledWith({
            placeHolder: 'Enter a regular expression to highlight text'
        });
    });

});
