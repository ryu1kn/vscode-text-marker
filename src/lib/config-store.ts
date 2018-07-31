import * as Const from './const';
import ConfigurationTargetPicker from './config-target-picker';
import * as vscode from 'vscode';
import {Highlight} from './entities/highlight';

export default class ConfigStore {
    private readonly workspace: typeof vscode.workspace;
    private readonly configTargetPicker: ConfigurationTargetPicker;

    constructor(workspace, configTargetPicker) {
        this.workspace = workspace;
        this.configTargetPicker = configTargetPicker;
    }

    get highlightColors() {
        return this.get<string[]>('highlightColors');
    }

    get defaultHighlightColor() {
        return this.get<string>('defaultHighlightColor');
    }

    get savedHighlights() {
        return this.get<Highlight[]>('savedHighlights');
    }

    get delayForRefreshingHighlight() {
        return this.get<number>('delayForRefreshingHighlight');
    }

    get useHighlightColorOnRuler() {
        return this.get<boolean>('useHighlightColorOnRuler');
    }

    get autoSelectDistinctiveTextColor() {
        return this.get<boolean>('autoSelectDistinctiveTextColor');
    }

    get enableIgnoreCase() {
        return this.get<boolean>('enableIgnoreCase');
    }

    get enableWholeMatch() {
        return this.get<boolean>('enableWholeMatch');
    }

    private get<T>(configName) {
        const extensionConfig = this.workspace.getConfiguration(Const.EXTENSION_ID);
        return extensionConfig.get(configName) as T;
    }

    async set(configName, configValue) {
        const configTarget = await this.configTargetPicker.pick();
        const extensionConfig = this.workspace.getConfiguration(Const.EXTENSION_ID);
        return extensionConfig.update(configName, configValue, configTarget);
    }

}
