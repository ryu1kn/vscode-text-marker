
class HighlightPatternPicker {

    constructor(params) {
        this._decorationRegistry = params.decorationRegistry;
        this._vsWindow = params.vsWindow;
    }

    pick() {
        const decorations = this._decorationRegistry.retrieveAll();
        const selectItems = this._buildQuickPickItems(decorations);
        const options = {placeHolder: 'Select a pattern to remove highlight'};
        return this._vsWindow.showQuickPick(selectItems, options)
            .then(item => item ? item.id : null);
    }

    _buildQuickPickItems(decorations) {
        return decorations.map(decoration => {
            return {
                id: decoration.id,
                label: decoration.pattern.phrase,
                detail: this._buildDetail(decoration.pattern)
            };
        });
    }

    _buildDetail(pattern) {
        const caseSuffix = !pattern.ignoreCase ? ' [Aa]' : '';
        return `${pattern.type}${caseSuffix}`;
    }

}

module.exports = HighlightPatternPicker;
