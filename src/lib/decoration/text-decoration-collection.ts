import {Decoration} from '../entities/decoration';
import {TextEditorDecorationType} from 'vscode';
import Pattern from '../pattern/pattern';
import {OptionMap} from '../common/collection';
import {Option} from 'fp-ts/lib/Option';

export default class TextDecorationCollection {
    private readonly generateUuid: () => string;
    private readonly map: OptionMap<Decoration>;

    constructor(generateUuid: () => string) {
        this.generateUuid = generateUuid;

        this.map = new OptionMap();
    }

    add(pattern: Pattern, colour: string, decorationType: TextEditorDecorationType): Decoration {
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

    find(predicate: (d: Decoration) => boolean): Option<Decoration> {
        return this.map.find(predicate);
    }

    toList(): Decoration[] {
        return this.map.toList();
    }

}
