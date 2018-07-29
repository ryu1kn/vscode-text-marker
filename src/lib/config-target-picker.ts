import WindowComponent from './editor-components/window';

const ConfigurationTarget = {
    Global: 1,
    Workspace: 2
};

export default class ConfigurationTargetPicker {
    private readonly windowComponent: WindowComponent;

    constructor(windowComponent) {
        this.windowComponent = windowComponent;
    }

    async pick() {
        const selectItems = this.buildQuickPickItems();
        const options = {placeHolder: 'Select which scope of settings to save highlights to'};
        const item = await this.windowComponent.showQuickPick(selectItems, options);
        return item ? item.value : null;
    }

    private buildQuickPickItems() {
        return [
            {
                label: 'Global',
                value: ConfigurationTarget.Global
            },
            {
                label: 'Workspace',
                value: ConfigurationTarget.Workspace
            }
        ];
    }

}
