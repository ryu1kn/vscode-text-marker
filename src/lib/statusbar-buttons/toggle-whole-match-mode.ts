import * as Const from '../const';
const Event = Const.Event;

export default class ToggleWholeMatchModeButton {
    private readonly _eventBus: any;
    private readonly _statusBarItem: any;

    constructor(params) {
        this._eventBus = params.eventBus;
        this._statusBarItem = params.statusBarItem;
        this._registerListeners();
    }

    private _registerListeners() {
        this._eventBus.on(Event.MATCHING_MODE_INITIALISED, this._initialiseButton.bind(this));
        this._eventBus.on(Event.WHOLE_MATCH_MODE_TOGGLED, this._updateButton.bind(this));
    }

    private _initialiseButton(params) {
        this._updateButton(params);

        this._statusBarItem.command = `${Const.EXTENSION_ID}.toggleModeForWholeMatch`;
        this._statusBarItem.show();
    }

    private _updateButton({wholeMatch}) {
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
