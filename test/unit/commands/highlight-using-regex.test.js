
const HighlightUsingRegexCommand = require('../../../lib/commands/highlight-using-regex');

suite('HighlightUsingRegexCommand', () => {

    test('it decorates text that matches to the specified regex', () => {
        const decorationOperator = {addDecoration: sinon.spy()};
        const decorationOperatorFactory = {createForVisibleEditors: () => decorationOperator};
        const regexReader = {read: () => Promise.resolve('PATTERN')};
        const command = new HighlightUsingRegexCommand({decorationOperatorFactory, regexReader});

        return command.execute().then(() => {
            expect(decorationOperator.addDecoration).to.have.been.calledWith('PATTERN');
        });
    });

    test('it does nothing if regex is not given', () => {
        const decorationOperatorFactory = {createForVisibleEditors: sinon.spy()};
        const regexReader = {read: () => Promise.resolve()};
        const command = new HighlightUsingRegexCommand({decorationOperatorFactory, regexReader});

        return command.execute().then(() => {
            expect(decorationOperatorFactory.createForVisibleEditors).to.have.been.not.called;
        });
    });

});
