import {FlatRange} from './models/flat-range';
import {fromNullable, none, Option, some} from 'fp-ts/lib/Option';
import {OptionMap} from './utils/collections';

export default class TextLocationRegistry {
    private readonly recordMap: OptionMap<OptionMap<FlatRange[]>>;

    constructor() {
        this.recordMap = new OptionMap();
    }

    register(editorId: string, decorationId: string, ranges: FlatRange[]) {
        const editorDecorations = this.recordMap.get(editorId).toNullable() || new OptionMap();
        editorDecorations.set(decorationId, ranges);
        this.recordMap.set(editorId, editorDecorations);
    }

    deregister(decorationId: string) {
        Array.from(this.recordMap.values()).forEach(decorationIdMap => {
            decorationIdMap.delete(decorationId);
        });
    }

    queryDecorationId(editorId: string, flatRange: FlatRange) {
        const decoration = this.recordMap.get(editorId)
            .chain(decorationMap => fromNullable(
                Array.from(decorationMap.entries())
                    .find(([_decorationId, ranges]) => ranges.some(this.isPointingRange(flatRange)))
            ))
            .map(([decorationId, _ranges]) => decorationId);
        return decoration.toNullable();
    }

    findNextOccurence(editorId: string, range: FlatRange): Option<FlatRange> {
        const decorationId = this.queryDecorationId(editorId, range);
        if (!decorationId) return none;

        const ranges = this.recordMap.get(editorId).chain(em => em.get(decorationId)).getOrElse([]);
        const newIndex = ranges.findIndex(this.isPointingRange(range)) + 1;
        return some(ranges[newIndex === ranges.length ? 0 : newIndex]);
    }

    private isPointingRange(range2: FlatRange): (range: FlatRange) => boolean {
        return (range1: FlatRange) => {
            if (range2.start < range1.start || range2.end > range1.end) return false;
            return range2.start === range2.end ||
                (range1.start === range2.start && range1.end === range2.end);
        };
    }

}
