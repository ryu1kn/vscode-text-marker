import * as Const from './const';
import ConfigurationTargetPicker from './config-target-picker';

export default class ConfigStore {
    private readonly workspace: any;
    private readonly configTargetPicker: ConfigurationTargetPicker;

    constructor(workspace, configTargetPicker) {
        this.workspace = workspace;
        this.configTargetPicker = configTargetPicker;
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
