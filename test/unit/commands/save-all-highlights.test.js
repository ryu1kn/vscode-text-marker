
const SaveAllHighlightsCommand = require('../../../lib/commands/save-all-highlights');

suite('SaveAllHighlightsCommand', () => {
    let command;
    let configStore;
    const decorations = [{
        id: 'ID',
        colour: 'COLOUR',
        pattern: {
            type: 'TYPE',
            phrase: 'PHRASE',
            ignoreCase: 'IGNORE_CASE',
            wholeMatch: 'WHOLE_MATCH'
        }
    }];

    beforeEach(() => {
        const decorationRegistry = {retrieveAll: () => decorations};
        configStore = {set: sinon.stub().returns(Promise.resolve())};
        command = new SaveAllHighlightsCommand({decorationRegistry, configStore});
    });

    test('it lets DecorationOperator to remove all decorations', async () => {
        await command.execute();
        expect(configStore.set.args[0]).to.eql([
            'savedHighlights',
            [{
                color: 'COLOUR',
                pattern: {
                    type: 'TYPE',
                    phrase: 'PHRASE',
                    ignoreCase: 'IGNORE_CASE',
                    wholeMatch: 'WHOLE_MATCH'
                }
            }]
        ]);
    });

});
