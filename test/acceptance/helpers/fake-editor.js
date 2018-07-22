
exports.createFakeEditor = ({selectedText, wholeText} = {}) => {
    const selection = selectedText ? 'SELECTION' : null;
    return {
        document: {
            getText: selection => selection ? selectedText : wholeText,
            positionAt: position => `POSITION:${position}`,
            uri: 'EDITOR_ID'
        },
        selection,
        setDecorations: sinon.spy()
    };
};
