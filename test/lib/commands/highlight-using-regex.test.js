
const HighlightUsingRegexCommand = require('../../../lib/commands/highlight-using-regex');

suite('HighlightUsingRegexCommand', () => {

    test('it decorates text that matches to the specified regex', () => {
        const vsWindow = {visibleTextEditors: ['EDITOR_1', 'EDITOR_2']};
        const logger = getLogger();
        const decorationOperator = {addDecoration: sinon.spy()};
        const decorationOperatorFactory = {create: sinon.stub().returns(decorationOperator)};
        const regexReader = {read: () => Promise.resolve(/pattern/)};
        const command = new HighlightUsingRegexCommand({decorationOperatorFactory, regexReader, vsWindow, logger});

        return command.execute().then(() => {
            expect(decorationOperatorFactory.create).to.have.been.calledWith(['EDITOR_1', 'EDITOR_2']);
            expect(decorationOperator.addDecoration).to.have.been.calledWith(/pattern/);
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

    test('it logs error if an exception occurred', () => {
        const logger = {error: sinon.spy()};
        const regexReader = {read: () => Promise.reject(new Error('UNEXPECTED_ERROR'))};
        const command = new HighlightUsingRegexCommand({logger, regexReader});

        return command.execute().then(() => {
            expect(logger.error.args[0][0]).to.have.string('Error: UNEXPECTED_ERROR');
        });
    });

    function getLogger() {
        return console;
    }

});
