import WindowComponent, {QuickPickItem} from './vscode/window';
import {Option} from 'fp-ts/lib/Option';

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

    async pick(): Promise<Option<boolean>> {
        const selectItems = this.buildQuickPickItems();
        const options = {placeHolder: 'Select which scope of settings to save highlights to'};
        const item = await this.windowComponent.showQuickPick<ConfigurationTargetQuickPickItem>(selectItems, options).run();
        return item.map(it => it.value);
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
