const ConfigurationTarget = {
    Global: 1,
    Workspace: 2
};

export default class ConfigurationTargetPicker {
    private readonly _windowComponent: any;

    constructor(params) {
        this._windowComponent = params.windowComponent;
    }

    async pick() {
        const selectItems = this._buildQuickPickItems();
        const options = {placeHolder: 'Select which scope of settings to save highlights to'};
        const item = await this._windowComponent.showQuickPick(selectItems, options);
        return item ? item.value : null;
    }

    private _buildQuickPickItems() {
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
