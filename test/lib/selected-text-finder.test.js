
const SelectedTextFinder = require('../../lib/selected-text-finder');

suite('SelectedTextFinder', () => {

    test('it finds currently selected text in the editor', () => {
        const finder = new SelectedTextFinder();
        const editor = fakeEditor('SELECTED', 'STR1 SELECTED STR2 SELECTED');
        expect(finder.find(editor)).to.eql('SELECTED');
    });

    function fakeEditor(selectedText, entireText) {
        return {
            selection: {text: selectedText},
            document: {
                getText: selection => selection ? selection.text : entireText
            }
        };
    }

});
