import {OptionMap} from '../common/collection';
import {TextEditorDecorationType} from 'vscode';
import DecorationTypeCreator from './decoration-type-creator';
import ConfigStore from '../config-store';
import WindowComponent from '../vscode/window';
import * as O from 'fp-ts/lib/Option';
import {Decoration} from '../entities/decoration';
import {pipe} from 'fp-ts/lib/pipeable';

export class DecorationTypeRegistry {
    private readonly issued: OptionMap<TextEditorDecorationType>;
    private readonly decorationTypeCreator: DecorationTypeCreator;

    constructor(configStore: ConfigStore, window: WindowComponent) {
        this.issued = new OptionMap<TextEditorDecorationType>();
        this.decorationTypeCreator = new DecorationTypeCreator(configStore, window);
    }

    inquire(decorationId: string): O.Option<TextEditorDecorationType> {
        return this.issued.get(decorationId);
    }

    revoke(id: string): void {
        this.issued.delete(id);
    }

    provideFor(decoration: Decoration): TextEditorDecorationType {
        return pipe(
            this.inquire(decoration.id),
            O.getOrElse(() => this.issue(decoration))
        );
    }

    private issue(decoration: Decoration): TextEditorDecorationType {
        const decorationType = this.decorationTypeCreator.create(decoration.colour);
        this.issued.set(decoration.id, decorationType);
        return decorationType;
    }
}
