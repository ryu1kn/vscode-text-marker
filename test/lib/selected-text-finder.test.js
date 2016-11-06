
const SelectedTextFinder = require('../../lib/selected-text-finder');

suite('SelectedTextFinder', () => {

    test('it finds currently selected text in the editor', () => {
        const finder = new SelectedTextFinder();
        const editor = fakeEditor('SELECTED', 'STR1 SELECTED STR2 SELECTED');
        expect(finder.find(editor)).to.eql('SELECTED');
    });

    test('it selects a word where the cursor is currently on if no text is selected', () => {
        const finder = new SelectedTextFinder();
        const editor = fakeEditor('', 'ENTIRE TEXT', 'WORD');
        expect(finder.find(editor)).to.eql('WORD');
        expect(editor._getWordRangeAtPositionSpy).to.have.been.calledWith('CURSOR_POSITION');
    });

    test('it selects nothing if no text is selected and there is no word under the cursor', () => {
        const finder = new SelectedTextFinder();
        const editor = fakeEditor('', 'ENTIRE TEXT', undefined);
        expect(finder.find(editor)).to.be.undefined;
    });

    function fakeEditor(selectedText, entireText, wordUnderCursor) {
        const _getWordRangeAtPositionSpy = sinon.spy();
        const selection = {
            active: 'CURSOR_POSITION',
            text: selectedText
        };
        const document = {
            getText: range => {
                if (range === selection) return range.text;
                if (range === 'WORD_RANGE') return wordUnderCursor;
                return entireText;
            },
            getWordRangeAtPosition: cursorAt => {
                _getWordRangeAtPositionSpy(cursorAt);
                return 'WORD_RANGE';
            }
        };
        return {selection, document, _getWordRangeAtPositionSpy};
    }

});
