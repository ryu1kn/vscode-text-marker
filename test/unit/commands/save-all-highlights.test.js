
const SaveAllHighlightsCommand = require('../../../lib/commands/save-all-highlights');

suite('SaveAllHighlightsCommand', () => {
    let command;
    let configStore;
    const decorations = [{
        id: 'ID1',
        colour: 'COLOUR1',
        pattern: {
            type: 'String',
            phrase: 'PHRASE',
            ignoreCase: 'IGNORE_CASE',
            wholeMatch: 'WHOLE_MATCH'
        }
    }, {
        id: 'ID2',
        colour: 'COLOUR2',
        pattern: {
            type: 'RegExp',
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

    test('it saves highlight into config', async () => {
        await command.execute();
        expect(configStore.set.args[0][0]).to.eql('savedHighlights');
        expect(configStore.set.args[0][1][0]).to.eql({
            pattern: {
                type: 'string',
                expression: 'PHRASE',
                ignoreCase: 'IGNORE_CASE',
                wholeMatch: 'WHOLE_MATCH'
            }
        });
    });

    test('it encodes regular expression pattern as "regex"', async () => {
        await command.execute();
        expect(configStore.set.args[0][1][1]).to.eql({
            pattern: {
                type: 'regex',
                expression: 'PHRASE',
                ignoreCase: 'IGNORE_CASE',
                wholeMatch: 'WHOLE_MATCH'
            }
        });
    });
});
