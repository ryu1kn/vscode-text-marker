import DecorationRegistry from './decoration-registry';
import WindowComponent, {QuickPickItem} from '../vscode/window';
import {Decoration} from '../entities/decoration';
import Pattern from '../pattern/pattern';
import * as O from 'fp-ts/lib/Option';
import {getOptionM} from 'fp-ts/lib/OptionT';
import {task, Task, map} from 'fp-ts/lib/Task';

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

    pick(placeHolderText: string): Task<O.Option<Decoration>> {
        const decorations = this.decorationRegistry.retrieveAll();
        return decorations.length > 0 ?
            this.showPicker(decorations, placeHolderText) :
            map(_v => O.none)(this.showNoItemMessage());
    }

    private showPicker(decorations: Decoration[], placeHolderText: string): Task<O.Option<Decoration>> {
        const selectItems = this.buildQuickPickItems(decorations);
        const options = {placeHolder: placeHolderText};
        return getOptionM(task).map(
            this.windowComponent.showQuickPick<DecorationQuickPickItem>(selectItems, options),
            it => it.decoration
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

    private showNoItemMessage(): Task<string> {
        return this.windowComponent.showInformationMessage('No highlight is registered yet');
    }
}
