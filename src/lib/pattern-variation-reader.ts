import {PatternAction} from './const';

export default class PatternVariationReader {
    private readonly windowComponent: any;

    constructor(params) {
        this.windowComponent = params.windowComponent;
    }

    async read(currentPattern) {
        const items = this.buildSelectItems(currentPattern);
        const options = {placeHolder: 'Select how to update the highlight'};
        const item = await this.windowComponent.showQuickPick(items, options);
        if (!item) return null;

        switch (item.actionId) {    // eslint-disable-line default-case
        case PatternAction.TOGGLE_CASE_SENSITIVITY:
            return currentPattern.toggleCaseSensitivity();
        case PatternAction.TOGGLE_WHOLE_MATCH:
            return currentPattern.toggleWholeMatch();
        case PatternAction.UPDATE_PHRASE: {
            const options = {
                value: currentPattern.phrase,
                prompt: 'Enter a new pattern.'
            };
            const newPhrase = await this.windowComponent.showInputBox(options);
            return newPhrase ? currentPattern.updatePhrase(newPhrase) : null;
        }
        }
    }

    private buildSelectItems(pattern) {
        return [
            this.getToggleCaseSensitivityOption(pattern),
            this.getToggleWholeMatchOption(pattern),
            this.getUpdatePhraseOption(pattern)
        ];
    }

    private getToggleCaseSensitivityOption(pattern) {
        const label = pattern.ignoreCase ? 'Case Sensitive' : 'Case Insensitive';
        return {
            label: `Change to ${label}`,
            actionId: PatternAction.TOGGLE_CASE_SENSITIVITY
        };
    }

    private getToggleWholeMatchOption(pattern) {
        const label = pattern.wholeMatch ? 'Partial Match' : 'Whole Match';
        return {
            label: `Change to ${label}`,
            actionId: PatternAction.TOGGLE_WHOLE_MATCH
        };
    }

    private getUpdatePhraseOption(pattern) {
        const label = pattern.type === 'RegExp' ? 'RegExp Pattern' : 'Text Pattern';
        return {
            label: `Update ${label}`,
            actionId: PatternAction.UPDATE_PHRASE
        };
    }

}
