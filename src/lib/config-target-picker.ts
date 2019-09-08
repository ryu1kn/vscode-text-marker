import WindowComponent, {QuickPickItem} from './vscode/window';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';

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

    async pick(): Promise<O.Option<boolean>> {
        const selectItems = this.buildQuickPickItems();
        const options = {placeHolder: 'Select which scope of settings to save highlights to'};
        const item = await this.windowComponent.showQuickPick<ConfigurationTargetQuickPickItem>(selectItems, options)();
        return pipe(item, O.map(it => it.value));
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
