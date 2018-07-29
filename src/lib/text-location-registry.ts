
export default class TextLocationRegistry {
    private readonly _recordMap: Map<any, any>;

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

    queryDecorationId({editorId, flatRange}) {
        const decorationMap = this._recordMap.get(editorId) as Map<any, any>;
        if (!decorationMap) return null;

        const [decorationId = null] = Array.from(decorationMap.entries())
            .find(([_decorationId, ranges]) => ranges.some(this._isPointingRange(flatRange))) || [];
        return decorationId || null;
    }

    private _isPointingRange(range2) {
        return range1 => {
            if (range2.start < range1.start || range2.end > range1.end) return false;
            return range2.start === range2.end ||
                (range1.start === range2.start && range1.end === range2.end);
        };
    }

}
