
const Const = require('../const');
const Event = Const.Event;

class ToggleCaseSensitivityModeButton {

    constructor(params) {
        this._eventBus = params.eventBus;
        this._statusBarItem = params.statusBarItem;
        this._registerListeners();
    }

    _registerListeners() {
        this._eventBus.on(Event.MATCHING_MODE_INITIALISED, this._initialiseButton.bind(this));
        this._eventBus.on(Event.TOGGLED_CASE_SENSITIVITY, this._updateButton.bind(this));
    }

    _initialiseButton(params) {
        this._updateButton(params);

        this._statusBarItem.command = `${Const.EXTENSION_ID}.toggleModeForCaseSensitivity`;
        this._statusBarItem.show();
    }

    _updateButton({ignoreCase}) {
        const statusBarItem = this._statusBarItem;
        if (ignoreCase) {
            statusBarItem.text = 'Aa';
            statusBarItem.tooltip = `${Const.EXTENSION_NAME}: Case Insensitive Mode`;
        } else {
            statusBarItem.text = '[Aa]';
            statusBarItem.tooltip = `${Const.EXTENSION_NAME}: Case Sensitive Mode`;
        }
    }

}

module.exports = ToggleCaseSensitivityModeButton;
