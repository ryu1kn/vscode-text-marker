
const HighlightUsingRegexCommand = require('../../../lib/commands/highlight-using-regex');

suite('HighlightUsingRegexCommand', () => {

    test('it decorates text that matches to the specified regex', () => {
        const windowComponent = {visibleTextEditors: ['EDITOR_1', 'EDITOR_2']};
        const decorationOperator = {addDecoration: sinon.spy()};
        const decorationOperatorFactory = {create: sinon.stub().returns(decorationOperator)};
        const regexReader = {read: () => Promise.resolve('PATTERN')};
        const command = new HighlightUsingRegexCommand({decorationOperatorFactory, regexReader, windowComponent});

        return command.execute().then(() => {
            expect(decorationOperatorFactory.create).to.have.been.calledWith(['EDITOR_1', 'EDITOR_2']);
            expect(decorationOperator.addDecoration).to.have.been.calledWith('PATTERN');
        });
    });

    test('it does nothing if regex is not given', () => {
        const decorationOperatorFactory = {create: sinon.spy()};
        const regexReader = {read: () => Promise.resolve()};
        const command = new HighlightUsingRegexCommand({decorationOperatorFactory, regexReader});

        return command.execute().then(() => {
            expect(decorationOperatorFactory.create).to.have.been.not.called;
        });
    });

});
