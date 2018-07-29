import * as Const from './const';

export default class ConfigStore {
    private readonly workspace: any;
    private readonly configTargetPicker: any;

    constructor(params) {
        this.workspace = params.workspace;
        this.configTargetPicker = params.configTargetPicker;
    }

    get(configName) {
        const extensionConfig = this.workspace.getConfiguration(Const.EXTENSION_ID);
        return extensionConfig.get(configName);
    }

    async set(configName, configValue) {
        const configTarget = await this.configTargetPicker.pick();
        const extensionConfig = this.workspace.getConfiguration(Const.EXTENSION_ID);
        return extensionConfig.update(configName, configValue, configTarget);
    }

}
