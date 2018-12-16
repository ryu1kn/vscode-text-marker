import ConfigStore from '../config-store';
import ColourRegistry from '../colour-registry';
import Pattern from '../pattern/pattern';
import {Decoration} from '../entities/decoration';
import {none, Option, some} from 'fp-ts/lib/Option';
import {OptionMap} from '../common/collection';

export default class DecorationRegistry {
    private readonly colourRegistry: ColourRegistry;
    private readonly map: OptionMap<Decoration>;
    private readonly generateUuid: () => string;

    constructor(configStore: ConfigStore,
                generateUuid: () => string) {
        this.colourRegistry = new ColourRegistry(configStore);

        this.generateUuid = generateUuid;
        this.map = new OptionMap();
    }

    inquireById(decorationId: string): Option<Decoration> {
        return this.map.get(decorationId);
    }

    inquireByPattern(pattern: Pattern): Option<Decoration> {
        const isSamePattern = (decoration: Decoration) => decoration.pattern.equalTo(pattern);
        return this.map.find(isSamePattern);
    }

    issue(pattern: Pattern, colour?: string): Option<Decoration> {
        const decorationOpt = this.inquireByPattern(pattern);
        return decorationOpt.isSome() ?
            none :
            some(this.setDecoration(this.createDecoration(pattern, colour)));
    }

    private createDecoration(pattern: Pattern, colour?: string): Decoration {
        const id = this.generateUuid();
        if (colour) {
            this.colourRegistry.reserve(colour);
            return new Decoration(id, pattern, colour);
        } else {
            return new Decoration(id, pattern, this.colourRegistry.issue());
        }
    }

    update(oldDecoration: Decoration, newDecoration: Decoration): void {
        this.map.set(newDecoration.id, newDecoration);
    }

    private setDecoration(decoration: Decoration): Decoration {
        this.map.set(decoration.id, decoration);
        return decoration;
    }

    revoke(decorationId: string): void {
        const decoration = this.map.get(decorationId);
        decoration.map(d => {
            this.colourRegistry.revoke(d.colour);
            this.map.delete(decorationId);
        });
    }

    retrieveAll() {
        return this.map.toList();
    }
}
