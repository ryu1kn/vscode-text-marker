import WindowComponent, {QuickPickItem} from '../vscode/window';
import {Option, some} from 'fp-ts/lib/Option';
import {Decoration} from '../entities/decoration';
import {TelemetryReporterLocator} from '../telemetry/telemetry-reporter-locator';
import {TelemetryReporter} from '../telemetry/telemetry-reporter';
import {Task, task} from 'fp-ts/lib/Task';
import {getOptionT2v} from 'fp-ts/lib/OptionT';

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
    private telemetryReporter: TelemetryReporter;

    constructor(windowComponent: WindowComponent) {
        this.windowComponent = windowComponent;
        this.telemetryReporter = TelemetryReporterLocator.getReporter();
    }

    read(currentDecoration: Decoration): Task<Option<Decoration>> {
        const items = this.buildSelectItems(currentDecoration);
        const options = {placeHolder: 'Select how to update the highlight'};
        const item = new Task(() => this.windowComponent.showQuickPick<DecorationUpdateActionQuickPickItem>(items, options));
        return getOptionT2v(task).chain(item, it => this.createDecoration(currentDecoration, it));
    }

    private createDecoration(currentDecoration: Decoration, item: DecorationUpdateActionQuickPickItem): Task<Option<Decoration>> {
        this.telemetryReporter.logHighlightUpdated(item.actionId);
        switch (item.actionId) {
            case DecorationAction.TOGGLE_CASE_SENSITIVITY:
                return task.of(some(currentDecoration.withCaseSensitivityToggled()));
            case DecorationAction.TOGGLE_WHOLE_MATCH:
                return task.of(some(currentDecoration.withWholeMatchToggled()));
            case DecorationAction.UPDATE_PHRASE: {
                const options = {
                    value: currentDecoration.pattern.phrase,
                    prompt: 'Enter a new pattern.'
                };
                const newPhraseOpt = new Task(() => this.windowComponent.showInputBox(options));
                return getOptionT2v(task).map(newPhraseOpt, newPhrase => currentDecoration.withPhrase(newPhrase));
            }
            case DecorationAction.UPDATE_COLOUR: {
                const options = {
                    value: currentDecoration.colour,
                    prompt: 'Enter a new color.'
                };
                const newPhraseOpt = new Task(() => this.windowComponent.showInputBox(options));
                return getOptionT2v(task).map(newPhraseOpt, newColour => currentDecoration.withColour(newColour));
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
