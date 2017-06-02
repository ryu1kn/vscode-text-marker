
const Const = require('./const');

class ToggleCaseSensitivityModeButton {

    constructor(params) {
        this._eventBus = params.eventBus;
        this._statusBarItem = params.statusBarItem;
        this._registerListeners();
    }

    _registerListeners() {
        this._eventBus.on('MATCHING_MODE_INITIALISED', this._initialiseButton.bind(this));
        this._eventBus.on('TOGGLED_CASE_SENSITIVITY', this._updateButton.bind(this));
    }

    _initialiseButton(params) {
        this._updateButton(params);

        this._statusBarItem.command = `${Const.EXTENSION_ID}.toggleCaseSensitivityMode`;
        this._statusBarItem.show();
    }

    _updateButton(params) {
        const statusBarItem = this._statusBarItem;
        if (params.ignoreCase) {
            statusBarItem.text = '[Aa]';
            statusBarItem.tooltip = 'TextMarker: ignore case mode';
        } else {
            statusBarItem.text = 'Aa';
            statusBarItem.tooltip = 'TextMarker: Case sensitive mode';
        }
    }

}

module.exports = ToggleCaseSensitivityModeButton;
