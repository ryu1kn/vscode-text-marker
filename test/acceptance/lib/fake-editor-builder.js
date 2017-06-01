
class FakeEditorBuilder {

    build(params) {
        const selection = params.selectedText ? 'SELECTION' : null;
        return {
            document: {
                getText: selection => selection ? params.selectedText : params.wholeText,
                positionAt: position => `POSITION:${position}`
            },
            selection,
            setDecorations: sinon.spy()
        };
    }

}

module.exports = FakeEditorBuilder;
