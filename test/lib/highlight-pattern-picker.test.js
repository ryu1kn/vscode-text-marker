
const HighlightPatternPicker = require('../../lib/highlight-pattern-picker');

suite('HighlightPatternPicker', () => {

    test('it lets user to pick a highlight pattern', () => {
        const vscodeWindow = {
            showQuickPick: sinon.stub().returns(Promise.resolve({
                label: 'TEXT_1', detail: 'String', pattern: 'TEXT_1'
            }))
        };
        const decorationRegistry = {
            retrieveAll: () => [
                {pattern: 'TEXT_1', decorationType: 'DECORATION_TYPE_1'},
                {pattern: /TEXT_2/, decorationType: 'DECORATION_TYPE_2'}
            ]
        };
        const picker = new HighlightPatternPicker({decorationRegistry, vsWindow: vscodeWindow});
        return picker.pick().then(pattern => {
            expect(pattern).to.eql('TEXT_1');
            expect(vscodeWindow.showQuickPick).to.have.been.calledWith(
                [
                    {label: 'TEXT_1', detail: 'String', pattern: 'TEXT_1'},
                    {label: '/TEXT_2/', detail: 'RegExp', pattern: /TEXT_2/}
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
                {pattern: 'TEXT_1', decorationType: 'DECORATION_TYPE_1'}
            ]
        };
        const picker = new HighlightPatternPicker({decorationRegistry, vsWindow: vscodeWindow});
        return picker.pick().then(pattern => {
            expect(pattern).to.be.null;
        });
    });

});
