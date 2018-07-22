const {expect, sinon} = require('../../helpers/helper');

const HighlightUsingRegexCommand = require('../../../lib/commands/highlight-using-regex');

suite('HighlightUsingRegexCommand', () => {

    test('it decorates text that matches to the specified regex', async () => {
        const decorationOperator = {addDecoration: sinon.spy()};
        const decorationOperatorFactory = {createForVisibleEditors: () => decorationOperator};
        const regexReader = {read: () => Promise.resolve('PATTERN')};
        const command = new HighlightUsingRegexCommand({decorationOperatorFactory, regexReader});

        await command.execute();

        expect(decorationOperator.addDecoration).to.have.been.calledWith('PATTERN');
    });

    test('it does nothing if regex is not given', async () => {
        const decorationOperatorFactory = {createForVisibleEditors: sinon.spy()};
        const regexReader = {read: () => Promise.resolve()};
        const command = new HighlightUsingRegexCommand({decorationOperatorFactory, regexReader});

        await command.execute();

        expect(decorationOperatorFactory.createForVisibleEditors).to.have.been.not.called;
    });

});
