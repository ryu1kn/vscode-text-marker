
const ConfigStore = require('../../lib/config-store');

suite('ConfigStore', () => {
    let extensionConfig;
    let configStore;

    beforeEach(() => {
        extensionConfig = {
            get: stubWithArgs(['CONFIG_NAME'], 'CONFIG_VALUE'),
            update: sinon.spy()
        };
        const workspace = {getConfiguration: stubWithArgs(['textmarker'], extensionConfig)};
        const configTargetPicker = {pick: () => 'CONFIG_TARGET'};
        configStore = new ConfigStore({workspace, configTargetPicker});
    });

    test('it returns the current config from vscode.workspace', () => {
        expect(configStore.get('CONFIG_NAME')).to.eql('CONFIG_VALUE');
    });

    test('it sets a config value for the specified location', async () => {
        await configStore.set('CONFIG_NAME', 'CONFIG_VALUE');

        expect(extensionConfig.update).to.have.been.calledWith('CONFIG_NAME', 'CONFIG_VALUE', 'CONFIG_TARGET');
    });
});
