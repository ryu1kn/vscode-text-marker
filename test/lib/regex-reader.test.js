
const RegexReader = require('../../lib/regex-reader');

suite('RegexReader', () => {

    test('shows inputBox to let user enter regex', () => {
        const vscodeWindow = {
            showInputBox: sinon.stub().returns(Promise.resolve('pattern'))
        };
        const reader = new RegexReader({vsWindow: vscodeWindow});
        return reader.read().then(regex => {
            expect(regex).to.eql(/pattern/);
            expect(vscodeWindow.showInputBox).to.have.been.calledWith({
                placeHolder: 'Enter a regular expression to highlight text'
            });
        });
    });

});
