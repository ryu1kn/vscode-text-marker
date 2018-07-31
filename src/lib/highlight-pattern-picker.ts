import DecorationRegistry from './decoration-registry';
import WindowComponent from './editor-components/window';
import {QuickPickItem} from 'vscode';

interface HighlightPatternQuickPickItem extends QuickPickItem {
    id: string;
}

export default class HighlightPatternPicker {
    private readonly decorationRegistry: DecorationRegistry;
    private readonly windowComponent: WindowComponent;

    constructor(decorationRegistry, windowComponent) {
        this.decorationRegistry = decorationRegistry;
        this.windowComponent = windowComponent;
    }

    pick(placeHolderText) {
        const decorations = this.decorationRegistry.retrieveAll();
        return decorations.length > 0 ?
            this.showPicker(decorations, placeHolderText) :
            this.showNoItemMessage();
    }

    private async showPicker(decorations, placeHolderText) {
        const selectItems = this.buildQuickPickItems(decorations);
        const options = {placeHolder: placeHolderText};
        const item = await this.windowComponent.showQuickPick<HighlightPatternQuickPickItem>(selectItems, options);
        return item ? item.id : null;
    }

    private buildQuickPickItems(decorations): HighlightPatternQuickPickItem[] {
        return decorations.map(decoration => ({
            id: decoration.id,
            label: decoration.pattern.displayText,
            detail: this.buildDetail(decoration.pattern)
        }));
    }

    private buildDetail(pattern) {
        const caseSuffix = !pattern.ignoreCase ? ' [Aa]' : '';
        const wholeMatchSuffix = pattern.wholeMatch ? ' [Ab|]' : '';
        return `${pattern.type}${caseSuffix}${wholeMatchSuffix}`;
    }

    private showNoItemMessage() {
        return this.windowComponent.showInformationMessage('No highlight is registered yet');
    }

}
