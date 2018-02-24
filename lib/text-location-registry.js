
class TextLocationRegistry {

    constructor() {
        this._recordMap = new Map();
    }

    register({editorId, decorationId, ranges}) {
        const editorDecorations = this._recordMap.get(editorId) || new Map();
        editorDecorations.set(decorationId, ranges);
        this._recordMap.set(editorId, editorDecorations);
    }

    deregister(decorationId) {
        Array.from(this._recordMap.values()).forEach(decorationIdMap => {
            decorationIdMap.delete(decorationId);
        });
    }

    queryDecorationId({editorId, offset}) {
        const decorationMap = this._recordMap.get(editorId);
        if (!decorationMap) return null;

        const [decorationId] = Array.from(decorationMap.entries())
            .find(([_decorationId, ranges]) =>
                ranges.some(range => range.start <= offset && offset <= range.end)
            ) || [];
        return decorationId || null;
    }

}

module.exports = TextLocationRegistry;
