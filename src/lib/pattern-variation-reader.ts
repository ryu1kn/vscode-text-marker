import {PatternAction} from './const';
import WindowComponent from './editor-components/window';
import {QuickPickItem} from 'vscode';
import Pattern from './patterns/pattern';

interface PatternUpdateActionQuickPickItem extends QuickPickItem {
    actionId: symbol;
}

export default class PatternVariationReader {
    private readonly windowComponent: WindowComponent;

    constructor(windowComponent: WindowComponent) {
        this.windowComponent = windowComponent;
    }

    async read(currentPattern: Pattern): Promise<Pattern | undefined> {
        const items = this.buildSelectItems(currentPattern);
        const options = {placeHolder: 'Select how to update the highlight'};
        const item = await this.windowComponent.showQuickPick<PatternUpdateActionQuickPickItem>(items, options);
        if (!item) return;

        switch (item.actionId) {
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
                return newPhrase ? currentPattern.updatePhrase(newPhrase) : undefined;
            }
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
            actionId: PatternAction.TOGGLE_CASE_SENSITIVITY,
            description: ''
        };
    }

    private getToggleWholeMatchOption(pattern: Pattern) {
        const label = pattern.wholeMatch ? 'Partial Match' : 'Whole Match';
        return {
            label: `Change to ${label}`,
            actionId: PatternAction.TOGGLE_WHOLE_MATCH,
            description: ''
        };
    }

    private getUpdatePhraseOption(pattern: Pattern) {
        const label = pattern.type === 'RegExp' ? 'RegExp Pattern' : 'Text Pattern';
        return {
            label: `Update ${label}`,
            actionId: PatternAction.UPDATE_PHRASE,
            description: ''
        };
    }

}
