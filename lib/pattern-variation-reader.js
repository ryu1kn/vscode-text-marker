
const PatternAction = require('./const').PatternAction;

class PatternVariationReader {

    constructor(params) {
        this._windowComponent = params.windowComponent;
    }

    read(currentPattern) {
        const items = this._buildSelectItems(currentPattern);
        return this._windowComponent.showQuickPick(items).then(item => {
            if (!item) return null;

            switch (item.actionId) {    // eslint-disable-line default-case
            case PatternAction.TOGGLE_CASE_SENSITIVITY:
                return currentPattern.toggleCaseSensitivity();
            case PatternAction.TOGGLE_WHOLE_MATCH:
                return currentPattern.toggleWholeMatch();
            case PatternAction.UPDATE_PHRASE:
                return this._windowComponent.showInputBox().then(newPhrase =>
                    newPhrase ? currentPattern.updatePhrase(newPhrase) : null
                );
            }
        });
    }

    _buildSelectItems(pattern) {
        return [
            this._getToggleCaseSensitivityOption(pattern),
            this._getToggleWholeMatchOption(pattern),
            this._getUpdatePhraseOption(pattern)
        ];
    }

    _getToggleCaseSensitivityOption(pattern) {
        const label = pattern.ignoreCase ? 'Case Sensitive' : 'Case Insensitive';
        return {
            label: `Change to ${label}`,
            actionId: PatternAction.TOGGLE_CASE_SENSITIVITY
        };
    }

    _getToggleWholeMatchOption(pattern) {
        const label = pattern.wholeMatch ? 'Partial Match' : 'Whole Match';
        return {
            label: `Change to ${label}`,
            actionId: PatternAction.TOGGLE_WHOLE_MATCH
        };
    }

    _getUpdatePhraseOption(pattern) {
        const label = pattern.type === 'RegExp' ? 'RegExp Pattern' : 'Text Pattern';
        return {
            label: `Update ${label}`,
            actionId: PatternAction.UPDATE_PHRASE
        };
    }

}

module.exports = PatternVariationReader;
