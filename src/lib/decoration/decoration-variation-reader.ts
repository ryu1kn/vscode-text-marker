import WindowComponent, {QuickPickItem} from '../vscode/window';
import {none, Option, some} from 'fp-ts/lib/Option';
import {Decoration} from '../entities/decoration';

enum DecorationAction {
    TOGGLE_CASE_SENSITIVITY = 'toggle-case-sensitivity',
    TOGGLE_WHOLE_MATCH = 'toggle-whole-match',
    UPDATE_PHRASE = 'update-phrase',
    UPDATE_COLOUR = 'update-colour'
}

interface DecorationUpdateActionQuickPickItem extends QuickPickItem {
    actionId: DecorationAction;
}

export default class DecorationVariationReader {
    private readonly windowComponent: WindowComponent;

    constructor(windowComponent: WindowComponent) {
        this.windowComponent = windowComponent;
    }

    async read(currentDecoration: Decoration): Promise<Option<Decoration>> {
        const items = this.buildSelectItems(currentDecoration);
        const options = {placeHolder: 'Select how to update the highlight'};
        const item = await this.windowComponent.showQuickPick<DecorationUpdateActionQuickPickItem>(items, options);
        if (!item) return none;

        switch (item.actionId) {
            case DecorationAction.TOGGLE_CASE_SENSITIVITY:
                return some(currentDecoration.withCaseSensitivityToggled());
            case DecorationAction.TOGGLE_WHOLE_MATCH:
                return some(currentDecoration.withWholeMatchToggled());
            case DecorationAction.UPDATE_PHRASE: {
                const options = {
                    value: currentDecoration.pattern.phrase,
                    prompt: 'Enter a new pattern.'
                };
                const newPhraseOpt = await this.windowComponent.showInputBox(options);
                return newPhraseOpt.map(newPhrase => currentDecoration.withPhrase(newPhrase));
            }
            case DecorationAction.UPDATE_COLOUR: {
                const options = {
                    value: currentDecoration.colour,
                    prompt: 'Enter a new color.'
                };
                const newPhraseOpt = await this.windowComponent.showInputBox(options);
                return newPhraseOpt.map(newColour => currentDecoration.withColour(newColour));
            }
        }
    }

    private buildSelectItems(decoration: Decoration): DecorationUpdateActionQuickPickItem[] {
        return [
            this.getToggleCaseSensitivityOption(decoration),
            this.getToggleWholeMatchOption(decoration),
            this.getUpdatePhraseOption(decoration),
            this.getUpdateColourOption(decoration)
        ];
    }

    private getToggleCaseSensitivityOption(decoration: Decoration) {
        const label = decoration.pattern.ignoreCase ? 'Case Sensitive' : 'Case Insensitive';
        return {
            label: `Change to ${label}`,
            actionId: DecorationAction.TOGGLE_CASE_SENSITIVITY
        };
    }

    private getToggleWholeMatchOption(decoration: Decoration) {
        const label = decoration.pattern.wholeMatch ? 'Partial Match' : 'Whole Match';
        return {
            label: `Change to ${label}`,
            actionId: DecorationAction.TOGGLE_WHOLE_MATCH
        };
    }

    private getUpdatePhraseOption(decoration: Decoration) {
        const label = decoration.pattern.type === 'RegExp' ? 'RegExp Pattern' : 'Text Pattern';
        return {
            label: `Update ${label}`,
            actionId: DecorationAction.UPDATE_PHRASE
        };
    }

    private getUpdateColourOption(decoration: Decoration) {
        return {
            label: 'Update Color',
            actionId: DecorationAction.UPDATE_COLOUR
        };
    }
}
