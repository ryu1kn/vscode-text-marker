const {expect, sinon} = require('../helpers/helper');

const HighlightPatternPicker = require('../../lib/highlight-pattern-picker');
const PatternFactory = require('../../lib/pattern-factory');

suite('HighlightPatternPicker', () => {

    const patternFactory = new PatternFactory({matchingModeRegistry: {}});

    test('it lets user to pick a highlight pattern', async () => {
        const windowComponent = {
            showQuickPick: sinon.stub().returns(Promise.resolve({
                label: 'TEXT_1', detail: 'String', id: 'DECORATION_ID_1'
            }))
        };
        const decorationRegistry = {
            retrieveAll: () => [
                {
                    id: 'DECORATION_ID_1',
                    decorationType: 'DECORATION_TYPE_1',
                    pattern: patternFactory.create({phrase: 'TEXT_1', ignoreCase: true})
                },
                {
                    id: 'DECORATION_ID_2',
                    decorationType: 'DECORATION_TYPE_2',
                    pattern: patternFactory.create({phrase: 'TEXT_2', type: 'RegExp', ignoreCase: true})
                }
            ]
        };
        const picker = new HighlightPatternPicker({decorationRegistry, windowComponent});
        const decorationId = await picker.pick('PLACEHOLDER_MESSAGE');

        expect(decorationId).to.eql('DECORATION_ID_1');
        expect(windowComponent.showQuickPick).to.have.been.calledWith(
            [
                {label: 'TEXT_1', detail: 'String', id: 'DECORATION_ID_1'},
                {label: '/TEXT_2/i', detail: 'RegExp', id: 'DECORATION_ID_2'}
            ],
            {placeHolder: 'PLACEHOLDER_MESSAGE'}
        );
    });

    test('it shows "[Aa]" symbol if a pattern is case sensitive', async () => {
        const windowComponent = {showQuickPick: sinon.stub().returns(Promise.resolve())};
        const decorationRegistry = {
            retrieveAll: () => [
                {
                    id: 'DECORATION_ID_1',
                    decorationType: 'DECORATION_TYPE_1',
                    pattern: patternFactory.create({phrase: 'TEXT_1'})
                },
                {
                    id: 'DECORATION_ID_2',
                    decorationType: 'DECORATION_TYPE_2',
                    pattern: patternFactory.create({phrase: 'TEXT_2', type: 'RegExp'})
                }
            ]
        };
        const picker = new HighlightPatternPicker({decorationRegistry, windowComponent});
        await picker.pick();

        expect(windowComponent.showQuickPick).to.have.been.calledWith(
            [
                {label: 'TEXT_1', detail: 'String [Aa]', id: 'DECORATION_ID_1'},
                {label: '/TEXT_2/', detail: 'RegExp [Aa]', id: 'DECORATION_ID_2'}
            ]
        );
    });

    test('it shows /i flag on regex if a pattern is case insensitive', async () => {
        const windowComponent = {showQuickPick: sinon.stub().returns(Promise.resolve())};
        const decorationRegistry = {
            retrieveAll: () => [
                {
                    id: 'DECORATION_ID',
                    decorationType: 'DECORATION_TYPE',
                    pattern: patternFactory.create({phrase: 'TEXT', type: 'RegExp', ignoreCase: true})
                }
            ]
        };
        const picker = new HighlightPatternPicker({decorationRegistry, windowComponent});

        await picker.pick();

        expect(windowComponent.showQuickPick).to.have.been.calledWith(
            [{label: '/TEXT/i', detail: 'RegExp', id: 'DECORATION_ID'}]
        );
    });

    test('it shows "[Aal]" symbol if a pattern is case sensitive', async () => {
        const windowComponent = {showQuickPick: sinon.stub().returns(Promise.resolve())};
        const decorationRegistry = {
            retrieveAll: () => [
                {
                    id: 'DECORATION_ID',
                    decorationType: 'DECORATION_TYPE',
                    pattern: patternFactory.create({phrase: 'TEXT', wholeMatch: true})
                }
            ]
        };
        const picker = new HighlightPatternPicker({decorationRegistry, windowComponent});
        await picker.pick();

        expect(windowComponent.showQuickPick).to.have.been.calledWith(
            [
                {label: 'TEXT', detail: 'String [Aa] [Ab|]', id: 'DECORATION_ID'}
            ]
        );
    });

    test('it returns null if nothing selected', async () => {
        const windowComponent = {
            showQuickPick: () => Promise.resolve()
        };
        const decorationRegistry = {
            retrieveAll: () => [
                {id: 'DECORATION_ID_1', pattern: patternFactory.create({phrase: 'TEXT_1'}), decorationType: 'DECORATION_TYPE_1'}
            ]
        };
        const picker = new HighlightPatternPicker({decorationRegistry, windowComponent});
        const decorationId = await picker.pick();

        expect(decorationId).to.be.null;
    });

    test('it shows a message instead of picker if no patterns are registered yet', async () => {
        const windowComponent = {
            showQuickPick: sinon.spy(),
            showInformationMessage: sinon.stub().returns(Promise.resolve())
        };
        const decorationRegistry = {
            retrieveAll: () => []
        };
        const picker = new HighlightPatternPicker({decorationRegistry, windowComponent});
        const decorationId = await picker.pick();

        expect(decorationId).to.be.undefined;
        expect(windowComponent.showInformationMessage).to.have.been.calledWith('No highlight is registered yet');
        expect(windowComponent.showQuickPick).to.not.have.been.called;
    });

});
