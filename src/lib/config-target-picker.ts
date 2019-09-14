import * as O from 'fp-ts/lib/Option';
import {getOptionM} from 'fp-ts/lib/OptionT';
import {Task, task} from 'fp-ts/lib/Task';
import WindowComponent, {QuickPickItem} from './vscode/window';

const ConfigurationTarget = {
    GLOBAL: true,
    WORKSPACE: false
};

interface ConfigurationTargetQuickPickItem extends QuickPickItem {
    value: boolean;
}

export default class ConfigurationTargetPicker {
    private readonly windowComponent: WindowComponent;

    constructor(windowComponent: WindowComponent) {
        this.windowComponent = windowComponent;
    }

    pick(): Task<O.Option<boolean>> {
        const selectItems = this.buildQuickPickItems();
        const options = {placeHolder: 'Select which scope of settings to save highlights to'};
        const item = this.windowComponent.showQuickPick<ConfigurationTargetQuickPickItem>(selectItems, options);
        return getOptionM(task).map(item, it => it.value);
    }

    private buildQuickPickItems(): ConfigurationTargetQuickPickItem[] {
        return [
            {
                label: 'Global',
                value: ConfigurationTarget.GLOBAL
            },
            {
                label: 'Workspace',
                value: ConfigurationTarget.WORKSPACE
            }
        ];
    }

}
