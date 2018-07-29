import * as Const from '../const';
const Event = Const.Event;

export default class ToggleWholeMatchModeButton {
    private _eventBus: any;
    private _statusBarItem: any;

    constructor(params) {
        this._eventBus = params.eventBus;
        this._statusBarItem = params.statusBarItem;
        this._registerListeners();
    }

    _registerListeners() {
        this._eventBus.on(Event.MATCHING_MODE_INITIALISED, this._initialiseButton.bind(this));
        this._eventBus.on(Event.WHOLE_MATCH_MODE_TOGGLED, this._updateButton.bind(this));
    }

    _initialiseButton(params) {
        this._updateButton(params);

        this._statusBarItem.command = `${Const.EXTENSION_ID}.toggleModeForWholeMatch`;
        this._statusBarItem.show();
    }

    _updateButton({wholeMatch}) {
        const statusBarItem = this._statusBarItem;
        if (wholeMatch) {
            statusBarItem.text = '[Ab|]';
            statusBarItem.tooltip = `${Const.EXTENSION_NAME}: Whole Match Mode`;
        } else {
            statusBarItem.text = 'Ab|';
            statusBarItem.tooltip = `${Const.EXTENSION_NAME}: Non-Whole Match Mode`;
        }
    }

}
