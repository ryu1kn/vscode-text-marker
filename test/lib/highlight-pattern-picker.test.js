
const HighlightPatternPicker = require('../../lib/highlight-pattern-picker');
const PatternFactory = require('../../lib/pattern-factory');

suite('HighlightPatternPicker', () => {

    const patternFactory = new PatternFactory();

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
                    pattern: patternFactory.create({phrase: 'TEXT_1'})
                },
                {
                    id: 'DECORATION_ID_2',
                    decorationType: 'DECORATION_TYPE_2',
                    pattern: patternFactory.create({phrase: 'TEXT_2', type: 'RegExp'})
                }
            ]
        };
        const picker = new HighlightPatternPicker({decorationRegistry, vsWindow: vscodeWindow});
        return picker.pick().then(decorationId => {
            expect(decorationId).to.eql('DECORATION_ID_1');
            expect(vscodeWindow.showQuickPick).to.have.been.calledWith(
                [
                    {label: 'TEXT_1', detail: 'String', id: 'DECORATION_ID_1'},
                    {label: '/TEXT_2/', detail: 'RegExp', id: 'DECORATION_ID_2'}
                ],
                {placeHolder: 'Select a pattern to remove highlight'}
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
        return picker.pick().then(pattern => {
            expect(pattern).to.be.null;
        });
    });

});
