import * as vscode from 'vscode';
import ConfigStore from '../config-store';
import ColourRegistry from '../colour-registry';
import Pattern from '../pattern/pattern';
import {Decoration} from '../entities/decoration';
import {none, Option, some} from 'fp-ts/lib/Option';
import DecorationTypeCreator from './decoration-type-creator';
import {OptionMap} from '../common/collection';

export default class DecorationRegistry {
    private readonly colourRegistry: ColourRegistry;
    private readonly decorationTypeCreator: DecorationTypeCreator;
    private readonly map: OptionMap<Decoration>;
    private readonly generateUuid: () => string;

    constructor(configStore: ConfigStore,
                window: typeof vscode.window,
                generateUuid: () => string) {
        this.colourRegistry = new ColourRegistry(configStore);
        this.decorationTypeCreator = new DecorationTypeCreator(configStore, window);

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

    issue(pattern: Pattern): Option<Decoration> {
        const decorationOpt = this.inquireByPattern(pattern);
        return decorationOpt.isSome() ?
            none :
            some(this.setDecoration(this.createDecoration(pattern)));
    }

    private createDecoration(pattern: Pattern): Decoration {
        const id = this.generateUuid();
        const colour = this.colourRegistry.issue();
        const decorationType = this.decorationTypeCreator.create(colour);
        return new Decoration(id, pattern, colour, decorationType);
    }

    updatePattern(decorationId: string, newPattern: Pattern): Option<Decoration> {
        const decorationOpt = this.map.get(decorationId);
        return decorationOpt.map(d => {
            return this.setDecoration(d.withPattern(newPattern));
        });
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
