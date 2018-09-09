import DecorationRegistry from './decoration-registry';
import WindowComponent, {QuickPickItem} from '../vscode/window';
import {Decoration} from '../entities/decoration';
import Pattern from '../pattern/pattern';

interface DecorationQuickPickItem extends QuickPickItem {
    id: string;
}

export default class DecorationPicker {
    private readonly decorationRegistry: DecorationRegistry;
    private readonly windowComponent: WindowComponent;

    constructor(decorationRegistry: DecorationRegistry,
                windowComponent: WindowComponent) {
        this.decorationRegistry = decorationRegistry;
        this.windowComponent = windowComponent;
    }

    pick(placeHolderText: string) {
        const decorations = this.decorationRegistry.retrieveAll();
        return decorations.length > 0 ?
            this.showPicker(decorations, placeHolderText) :
            this.showNoItemMessage();
    }

    private async showPicker(decorations: Decoration[], placeHolderText: string) {
        const selectItems = this.buildQuickPickItems(decorations);
        const options = {placeHolder: placeHolderText};
        const item = await this.windowComponent.showQuickPick<DecorationQuickPickItem>(selectItems, options);
        return item ? item.id : null;
    }

    private buildQuickPickItems(decorations: Decoration[]): DecorationQuickPickItem[] {
        return decorations.map(decoration => ({
            id: decoration.id,
            label: decoration.pattern.displayText,
            detail: this.buildDetail(decoration.pattern)
        }));
    }

    private buildDetail(pattern: Pattern) {
        const caseSuffix = !pattern.ignoreCase ? ' [Aa]' : '';
        const wholeMatchSuffix = pattern.wholeMatch ? ' [Ab|]' : '';
        return `${pattern.type}${caseSuffix}${wholeMatchSuffix}`;
    }

    private showNoItemMessage() {
        return this.windowComponent.showInformationMessage('No highlight is registered yet');
    }

}
