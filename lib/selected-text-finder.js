
class SelectedTextFinder {

    find(editor) {
        return editor.document.getText(editor.selection); // TODO: consider selectionS
    }

}

module.exports = SelectedTextFinder;
