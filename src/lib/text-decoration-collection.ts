import {Decoration} from './entities/decoration';
import {TextEditorDecorationType} from 'vscode';
import Pattern from './patterns/pattern';
import {OptionMap} from './utils/collections';
import {Option} from 'fp-ts/lib/Option';

export default class TextDecorationCollection {
    private readonly generateUuid: () => string;
    private readonly map: OptionMap<Decoration>;

    constructor(generateUuid: () => string) {
        this.generateUuid = generateUuid;

        this.map = new OptionMap();
    }

    add(pattern: Pattern, colour: string, decorationType: TextEditorDecorationType) {
        const id = this.generateUuid();
        const decoration = {id, pattern, colour, decorationType};
        this.map.set(id, decoration);
        return decoration;
    }

    get(id: string): Option<Decoration> {
        return this.map.get(id);
    }

    remove(id: string): void {
        this.map.delete(id);
    }

    find(predicate: (d: Decoration) => boolean) {
        return Array.from(this.map.values())
            .find(decoration => predicate(decoration)) || null;
    }

    toList() {
        return Array.from(this.map.values())
            .reduce((result, decoration) => [...result, decoration], [] as Decoration[]);
    }

}
