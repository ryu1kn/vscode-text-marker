import {FlatRange} from './vscode/flat-range';
import {Option} from 'fp-ts/lib/Option';
import {OptionMap} from './common/collection';
import {findFirst} from 'fp-ts/lib/Array';

export default class TextLocationRegistry {
    private readonly recordMap: OptionMap<OptionMap<FlatRange[]>>;

    constructor() {
        this.recordMap = new OptionMap();
    }

    register(editorId: string, decorationId: string, ranges: FlatRange[]) {
        const editorDecorations = this.recordMap.get(editorId).getOrElse(new OptionMap());
        editorDecorations.set(decorationId, ranges);
        this.recordMap.set(editorId, editorDecorations);
    }

    deregister(decorationId: string) {
        [...this.recordMap.values()].forEach(decorationIdMap => {
            decorationIdMap.delete(decorationId);
        });
    }

    queryDecorationId(editorId: string, range: FlatRange): Option<string> {
        return this.findDecorationIdAndRanges(editorId, range).map(([decorationId]) => decorationId);
    }

    findNextOccurence(editorId: string, range: FlatRange): Option<FlatRange> {
        return this.findDecorationIdAndRanges(editorId, range)
            .map(([_, ranges]) => {
                const newIndex = ranges.findIndex(this.isPointingRange(range)) + 1;
                return ranges[newIndex === ranges.length ? 0 : newIndex];
            });
    }

    findPreviousOccurence(editorId: string, range: FlatRange): Option<FlatRange> {
        return this.findDecorationIdAndRanges(editorId, range)
            .map(([_, ranges]) => {
                const newIndex = ranges.findIndex(this.isPointingRange(range)) - 1;
                return ranges[newIndex < 0 ? ranges.length - 1 : newIndex];
            });
    }

    private findDecorationIdAndRanges(editorId: string, range: FlatRange): Option<[string, FlatRange[]]> {
        return this.recordMap.get(editorId).chain(decorationMap => findFirst(
            [...decorationMap.entries()],
            ([_decorationId, ranges]) => ranges.some(this.isPointingRange(range))
        ));
    }

    private isPointingRange(range2: FlatRange): (range: FlatRange) => boolean {
        return (range1: FlatRange) => {
            if (range2.start < range1.start || range2.end > range1.end) return false;
            return range2.start === range2.end ||
                (range1.start === range2.start && range1.end === range2.end);
        };
    }

}
