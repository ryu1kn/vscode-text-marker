
const RegexReader = require('../../lib/regex-reader');

suite('RegexReader', () => {

    test('shows inputBox to let user enter regex', () => {
        const patternFactory = {create: sinon.stub().returns('PATTERN')};
        const vscodeWindow = {
            showInputBox: sinon.stub().returns(Promise.resolve('PATTERN_STRING'))
        };
        const reader = new RegexReader({
            patternFactory,
            vsWindow: vscodeWindow
        });
        return reader.read().then(pattern => {
            expect(pattern).to.eql('PATTERN');
            expect(patternFactory.create).to.have.been.calledWith({
                type: 'RegExp',
                pattern: 'PATTERN_STRING'
            });
            expect(vscodeWindow.showInputBox).to.have.been.calledWith({
                placeHolder: 'Enter a regular expression to highlight text'
            });
        });
    });

});
