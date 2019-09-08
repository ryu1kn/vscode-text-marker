import DecorationRegistry from './decoration-registry';
import WindowComponent, {QuickPickItem} from '../vscode/window';
import {Decoration} from '../entities/decoration';
import Pattern from '../pattern/pattern';
import * as O from 'fp-ts/lib/Option';
import {pipe} from 'fp-ts/lib/pipeable';

interface DecorationQuickPickItem extends QuickPickItem {
    decoration: Decoration;
}

export default class DecorationPicker {
    private readonly decorationRegistry: DecorationRegistry;
    private readonly windowComponent: WindowComponent;

    constructor(decorationRegistry: DecorationRegistry,
                windowComponent: WindowComponent) {
        this.decorationRegistry = decorationRegistry;
        this.windowComponent = windowComponent;
    }

    pick(placeHolderText: string): Promise<O.Option<Decoration>> {
        const decorations = this.decorationRegistry.retrieveAll();
        return decorations.length > 0 ?
            this.showPicker(decorations, placeHolderText) :
            this.showNoItemMessage();
    }

    private async showPicker(decorations: Decoration[], placeHolderText: string): Promise<O.Option<Decoration>> {
        const selectItems = this.buildQuickPickItems(decorations);
        const options = {placeHolder: placeHolderText};
        return pipe(
            await this.windowComponent.showQuickPick<DecorationQuickPickItem>(selectItems, options)(),
            O.map(it => it.decoration)
        );
    }

    private buildQuickPickItems(decorations: Decoration[]): DecorationQuickPickItem[] {
        return decorations.map(decoration => ({
            decoration,
            label: decoration.pattern.displayText,
            detail: this.buildDetail(decoration.pattern)
        }));
    }

    private buildDetail(pattern: Pattern): string {
        const caseSuffix = !pattern.ignoreCase ? ' [Aa]' : '';
        const wholeMatchSuffix = pattern.wholeMatch ? ' [Ab|]' : '';
        return `${pattern.type}${caseSuffix}${wholeMatchSuffix}`;
    }

    private async showNoItemMessage(): Promise<O.Option<never>> {
        await this.windowComponent.showInformationMessage('No highlight is registered yet');
        return O.none;
    }
}
