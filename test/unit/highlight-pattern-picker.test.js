
const HighlightPatternPicker = require('../../lib/highlight-pattern-picker');
const PatternFactory = require('../../lib/pattern-factory');

suite('HighlightPatternPicker', () => {

    const patternFactory = new PatternFactory({matchingModeRegistry: {}});

    test('it lets user to pick a highlight pattern', () => {
        const vscodeWindow = {
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
        const picker = new HighlightPatternPicker({decorationRegistry, vsWindow: vscodeWindow});
        return picker.pick('PLACEHOLDER_MESSAGE').then(decorationId => {
            expect(decorationId).to.eql('DECORATION_ID_1');
            expect(vscodeWindow.showQuickPick).to.have.been.calledWith(
                [
                    {label: 'TEXT_1', detail: 'String', id: 'DECORATION_ID_1'},
                    {label: '/TEXT_2/i', detail: 'RegExp', id: 'DECORATION_ID_2'}
                ],
                {placeHolder: 'PLACEHOLDER_MESSAGE'}
            );
        });
    });

    test('it shows "[Aa]" symbol if a pattern is case sensitive', () => {
        const vscodeWindow = {showQuickPick: sinon.stub().returns(Promise.resolve())};
        const decorationRegistry = {
            retrieveAll: () => [
                {
                    id: 'DECORATION_ID',
                    decorationType: 'DECORATION_TYPE',
                    pattern: patternFactory.create({phrase: 'TEXT'})
                }
            ]
        };
        const picker = new HighlightPatternPicker({decorationRegistry, vsWindow: vscodeWindow});
        return picker.pick().then(_decorationId => {
            expect(vscodeWindow.showQuickPick).to.have.been.calledWith(
                [{label: 'TEXT', detail: 'String [Aa]', id: 'DECORATION_ID'}]
            );
        });
    });

    test('it shows /i flag on regex if a pattern is case insensitive', () => {
        const vscodeWindow = {showQuickPick: sinon.stub().returns(Promise.resolve())};
        const decorationRegistry = {
            retrieveAll: () => [
                {
                    id: 'DECORATION_ID',
                    decorationType: 'DECORATION_TYPE',
                    pattern: patternFactory.create({phrase: 'TEXT', type: 'RegExp', ignoreCase: true})
                }
            ]
        };
        const picker = new HighlightPatternPicker({decorationRegistry, vsWindow: vscodeWindow});
        return picker.pick().then(_decorationId => {
            expect(vscodeWindow.showQuickPick).to.have.been.calledWith(
                [{label: '/TEXT/i', detail: 'RegExp', id: 'DECORATION_ID'}]
            );
        });
    });

    test('it returns null if nothing selected', () => {
        const vscodeWindow = {
            showQuickPick: () => Promise.resolve()
        };
        const decorationRegistry = {
            retrieveAll: () => [
                {id: 'DECORATION_ID_1', pattern: patternFactory.create({phrase: 'TEXT_1'}), decorationType: 'DECORATION_TYPE_1'}
            ]
        };
        const picker = new HighlightPatternPicker({decorationRegistry, vsWindow: vscodeWindow});
        return picker.pick().then(decorationId => {
            expect(decorationId).to.be.null;
        });
    });

    test('it shows a message instead of picker if no patterns are registered yet', () => {
        const vscodeWindow = {
            showQuickPick: sinon.spy(),
            showInformationMessage: sinon.stub().returns(Promise.resolve())
        };
        const decorationRegistry = {
            retrieveAll: () => []
        };
        const picker = new HighlightPatternPicker({decorationRegistry, vsWindow: vscodeWindow});
        return picker.pick().then(decorationId => {
            expect(decorationId).to.be.undefined;
            expect(vscodeWindow.showInformationMessage).to.have.been.calledWith('No highlight is registered yet');
            expect(vscodeWindow.showQuickPick).to.not.have.been.called;
        });
    });

});
