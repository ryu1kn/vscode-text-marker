import {mock, mockMethods, verify, when} from '../helpers/mock';

import ConfigStore from '../../lib/config-store';
import * as vscode from 'vscode';
import ConfigurationTargetPicker from '../../lib/config-target-picker';
import * as assert from 'assert';

suite('ConfigStore', () => {
    let extensionConfig: any;
    let configStore: any;

    setup(() => {
        extensionConfig = mockMethods<vscode.WorkspaceConfiguration>(['get', 'update']);
        when(extensionConfig.get('CONFIG_NAME')).thenReturn('CONFIG_VALUE');

        const workspace = mockMethods<typeof vscode.workspace>(['getConfiguration']);
        when(workspace.getConfiguration('textmarker')).thenReturn(extensionConfig);

        const configTargetPicker = mock(ConfigurationTargetPicker);
        when(configTargetPicker.pick()).thenResolve('CONFIG_TARGET');

        configStore = new ConfigStore(workspace, configTargetPicker);
    });

    test('it returns the current config from vscode.workspace', () => {
        assert.deepEqual(configStore.get('CONFIG_NAME'), 'CONFIG_VALUE');
    });

    test('it sets a config value for the specified location', async () => {
        await configStore.set('CONFIG_NAME', 'CONFIG_VALUE');

        verify(extensionConfig.update('CONFIG_NAME', 'CONFIG_VALUE', 'CONFIG_TARGET'));
    });
});
