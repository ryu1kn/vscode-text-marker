
'use strict';

class ConfigStore {
    constructor(params) {
        this._workspace = params.workspace;
    }

    get(configName) {
        const extensionConfig = this._workspace.getConfiguration('textmarker');
        return extensionConfig.get(configName);
    }
}

module.exports = ConfigStore;
