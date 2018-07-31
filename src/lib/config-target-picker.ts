import WindowComponent from './editor-components/window';
import {QuickPickItem} from 'vscode';

const ConfigurationTarget = {
    GLOBAL: true,
    WORKSPACE: false
};

interface ConfigurationTargetQuickPickItem extends QuickPickItem {
    value: boolean;
}

export default class ConfigurationTargetPicker {
    private readonly windowComponent: WindowComponent;

    constructor(windowComponent) {
        this.windowComponent = windowComponent;
    }

    async pick() {
        const selectItems = this.buildQuickPickItems();
        const options = {placeHolder: 'Select which scope of settings to save highlights to'};
        const item = await this.windowComponent.showQuickPick<ConfigurationTargetQuickPickItem>(selectItems, options);
        return item ? item.value : null;
    }

    private buildQuickPickItems(): ConfigurationTargetQuickPickItem[] {
        return [
            {
                label: 'Global',
                value: ConfigurationTarget.GLOBAL,
                description: null
            },
            {
                label: 'Workspace',
                value: ConfigurationTarget.WORKSPACE,
                description: null
            }
        ];
    }

}
