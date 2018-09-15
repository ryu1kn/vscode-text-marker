import {OptionMap} from '../common/collection';
import {TextEditorDecorationType} from 'vscode';
import DecorationTypeCreator from './decoration-type-creator';
import ConfigStore from '../config-store';
import WindowComponent from '../vscode/window';
import {Option} from 'fp-ts/lib/Option';
import {Decoration} from '../entities/decoration';

export class DecorationTypeRegistry {
    private readonly issued: OptionMap<TextEditorDecorationType>;
    private readonly decorationTypeCreator: DecorationTypeCreator;

    constructor(configStore: ConfigStore, window: WindowComponent) {
        this.issued = new OptionMap<TextEditorDecorationType>();
        this.decorationTypeCreator = new DecorationTypeCreator(configStore, window);
    }

    inquire(decorationId: string): Option<TextEditorDecorationType> {
        return this.issued.get(decorationId);
    }

    provideFor(decoration: Decoration): TextEditorDecorationType {
        const found = this.inquire(decoration.id).toUndefined();
        return found ? found : this.issue(decoration);
    }

    private issue(decoration: Decoration): TextEditorDecorationType {
        const decorationType = this.decorationTypeCreator.create(decoration.colour);
        this.issued.set(decoration.id, decorationType);
        return decorationType;
    }
}
