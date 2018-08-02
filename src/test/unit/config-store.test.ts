import {expect, mock, sinon, stubWithArgs, when} from '../helpers/helper';

import ConfigStore from '../../lib/config-store';
import * as vscode from "vscode";
import ConfigurationTargetPicker from "../../lib/config-target-picker";

suite('ConfigStore', () => {
    let extensionConfig: any;
    let configStore: any;

    setup(() => {
        extensionConfig = {
            get: stubWithArgs(['CONFIG_NAME'], 'CONFIG_VALUE'),
            update: sinon.spy()
        };
        const workspace = {getConfiguration: stubWithArgs(['textmarker'], extensionConfig)} as typeof vscode.workspace;
        const configTargetPicker = mock(ConfigurationTargetPicker);
        when(configTargetPicker.pick()).thenResolve('CONFIG_TARGET');
        configStore = new ConfigStore(workspace, configTargetPicker);
    });

    test('it returns the current config from vscode.workspace', () => {
        expect(configStore.get('CONFIG_NAME')).to.eql('CONFIG_VALUE');
    });

    test('it sets a config value for the specified location', async () => {
        await configStore.set('CONFIG_NAME', 'CONFIG_VALUE');

        expect(extensionConfig.update).to.have.been.calledWith('CONFIG_NAME', 'CONFIG_VALUE', 'CONFIG_TARGET');
    });
});
