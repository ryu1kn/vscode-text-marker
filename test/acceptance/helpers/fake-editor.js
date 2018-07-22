
exports.createFakeEditor = ({selectedText, wholeText} = {}) => {
    return {
        document: {
            getText: selection => selection ? selectedText : wholeText,
            positionAt: position,
            offsetAt: offset,
            uri: 'EDITOR_ID'
        },
        selection: createSelection(selectedText, wholeText),
        setDecorations: sinon.spy()
    };
};

function createSelection(selectedText, wholeText) {
    if (!selectedText) return null;
    return {
        start: position(wholeText.indexOf(selectedText)),
        end: position(wholeText.indexOf(selectedText) + selectedText.length)
    };
}

function position(offset) {
    return `POSITION:${offset}`;
}

function offset(position) {
    const POS_PREFIX = 'POSITION:';
    return position.startsWith(POS_PREFIX) && parseInt(position.replace(POS_PREFIX, ''), 10);
}
