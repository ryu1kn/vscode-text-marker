
class HighlightPatternPicker {

    constructor(params) {
        this._decorationRegistry = params.decorationRegistry;
        this._vsWindow = params.vsWindow;
    }

    pick(placeHolderText) {
        const decorations = this._decorationRegistry.retrieveAll();
        return decorations.length > 0 ?
            this._showPicker(decorations, placeHolderText) :
            this._showNoItemMessage();
    }

    _showPicker(decorations, placeHolderText) {
        const selectItems = this._buildQuickPickItems(decorations);
        const options = {placeHolder: placeHolderText};
        return this._vsWindow.showQuickPick(selectItems, options)
            .then(item => item ? item.id : null);
    }

    _buildQuickPickItems(decorations) {
        return decorations.map(decoration => ({
            id: decoration.id,
            label: decoration.pattern.displayText,
            detail: this._buildDetail(decoration.pattern)
        }));
    }

    _buildDetail(pattern) {
        const caseSuffix = !pattern.ignoreCase ? ' [Aa]' : '';
        const wholeMatchSuffix = pattern.wholeMatch ? ' [Ab|]' : '';
        return `${pattern.type}${caseSuffix}${wholeMatchSuffix}`;
    }

    _showNoItemMessage() {
        return this._vsWindow.showInformationMessage('No highlight is registered yet');
    }

}

module.exports = HighlightPatternPicker;
