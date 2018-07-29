
export default class HighlightPatternPicker {
    private readonly decorationRegistry: any;
    private readonly windowComponent: any;

    constructor(params) {
        this.decorationRegistry = params.decorationRegistry;
        this.windowComponent = params.windowComponent;
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
        const item = await this.windowComponent.showQuickPick(selectItems, options);
        return item ? item.id : null;
    }

    private buildQuickPickItems(decorations) {
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
