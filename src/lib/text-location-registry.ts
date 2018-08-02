import {FlatRange} from './models/flat-range';

export default class TextLocationRegistry {
    private readonly recordMap: Map<string, Map<string, FlatRange[]>>;

    constructor() {
        this.recordMap = new Map();
    }

    register(editorId: string, decorationId: string, ranges: FlatRange[]) {
        const editorDecorations = this.recordMap.get(editorId) || new Map();
        editorDecorations.set(decorationId, ranges);
        this.recordMap.set(editorId, editorDecorations);
    }

    deregister(decorationId: string) {
        Array.from(this.recordMap.values()).forEach(decorationIdMap => {
            decorationIdMap.delete(decorationId);
        });
    }

    queryDecorationId(editorId: string, flatRange: FlatRange) {
        const decorationMap = this.recordMap.get(editorId);
        if (!decorationMap) return null;

        const [decorationId = null] = Array.from(decorationMap.entries())
            .find(([_decorationId, ranges]) => ranges.some(this.isPointingRange(flatRange))) || [];
        return decorationId || null;
    }

    private isPointingRange(range2: FlatRange) {
        return (range1: FlatRange) => {
            if (range2.start < range1.start || range2.end > range1.end) return false;
            return range2.start === range2.end ||
                (range1.start === range2.start && range1.end === range2.end);
        };
    }

}
