import {PatternAction} from './const';
import WindowComponent, {QuickPickItem} from './editor-components/window';
import Pattern from './patterns/pattern';
import {none, Option, some} from 'fp-ts/lib/Option';

interface PatternUpdateActionQuickPickItem extends QuickPickItem {
    actionId: symbol;
}

export default class PatternVariationReader {
    private readonly windowComponent: WindowComponent;

    constructor(windowComponent: WindowComponent) {
        this.windowComponent = windowComponent;
    }

    async read(currentPattern: Pattern): Promise<Option<Pattern>> {
        const items = this.buildSelectItems(currentPattern);
        const options = {placeHolder: 'Select how to update the highlight'};
        const item = await this.windowComponent.showQuickPick<PatternUpdateActionQuickPickItem>(items, options);
        if (!item) return none;

        switch (item.actionId) {
            case PatternAction.TOGGLE_CASE_SENSITIVITY:
                return some(currentPattern.toggleCaseSensitivity());
            case PatternAction.TOGGLE_WHOLE_MATCH:
                return some(currentPattern.toggleWholeMatch());
            case PatternAction.UPDATE_PHRASE: {
                const options = {
                    value: currentPattern.phrase,
                    prompt: 'Enter a new pattern.'
                };
                const newPhraseOpt = await this.windowComponent.showInputBox(options);
                return newPhraseOpt.map(newPhrase => currentPattern.updatePhrase(newPhrase));
            }
            default:
                return none;
        }
    }

    private buildSelectItems(pattern: Pattern): PatternUpdateActionQuickPickItem[] {
        return [
            this.getToggleCaseSensitivityOption(pattern),
            this.getToggleWholeMatchOption(pattern),
            this.getUpdatePhraseOption(pattern)
        ];
    }

    private getToggleCaseSensitivityOption(pattern: Pattern) {
        const label = pattern.ignoreCase ? 'Case Sensitive' : 'Case Insensitive';
        return {
            label: `Change to ${label}`,
            actionId: PatternAction.TOGGLE_CASE_SENSITIVITY
        };
    }

    private getToggleWholeMatchOption(pattern: Pattern) {
        const label = pattern.wholeMatch ? 'Partial Match' : 'Whole Match';
        return {
            label: `Change to ${label}`,
            actionId: PatternAction.TOGGLE_WHOLE_MATCH
        };
    }

    private getUpdatePhraseOption(pattern: Pattern) {
        const label = pattern.type === 'RegExp' ? 'RegExp Pattern' : 'Text Pattern';
        return {
            label: `Update ${label}`,
            actionId: PatternAction.UPDATE_PHRASE
        };
    }

}
