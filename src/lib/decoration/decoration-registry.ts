import ConfigStore from '../config-store';
import ColourRegistry from '../colour-registry';
import Pattern from '../pattern/pattern';
import {Decoration} from '../entities/decoration';
import * as O from 'fp-ts/lib/Option';
import {OptionMap} from '../common/collection';
import {pipe} from 'fp-ts/lib/pipeable';

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

    inquireById(decorationId: string): O.Option<Decoration> {
        return this.map.get(decorationId);
    }

    inquireByPattern(pattern: Pattern): O.Option<Decoration> {
        const isSamePattern = (decoration: Decoration) => decoration.pattern.equalTo(pattern);
        return this.map.find(isSamePattern);
    }

    issue(pattern: Pattern, colour?: string): O.Option<Decoration> {
        return pipe(
            this.inquireByPattern(pattern),
            O.fold(
                () => O.some(this.setDecoration(this.createDecoration(pattern, colour))),
                () => O.none
            )
        );
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
        if (oldDecoration.colour !== newDecoration.colour) {
            this.colourRegistry.reserve(newDecoration.colour);
            // 多个规则可以共享同一颜色, 最后一个使用者离开后再释放.
            if (!this.retrieveAll().some(decoration => decoration.colour === oldDecoration.colour)) {
                this.colourRegistry.revoke(oldDecoration.colour);
            }
        }
    }

    private setDecoration(decoration: Decoration): Decoration {
        this.map.set(decoration.id, decoration);
        return decoration;
    }

    revoke(decorationId: string): void {
        pipe(
            this.map.get(decorationId),
            O.map(d => {
                this.map.delete(decorationId);
                if (!this.retrieveAll().some(decoration => decoration.colour === d.colour)) {
                    this.colourRegistry.revoke(d.colour);
                }
            })
        );
    }

    retrieveAll() {
        return this.map.toList();
    }
}
