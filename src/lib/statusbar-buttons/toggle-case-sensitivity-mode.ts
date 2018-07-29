import * as Const from '../const';
const Event = Const.Event;

export default class ToggleCaseSensitivityModeButton {
    private readonly eventBus: any;
    private readonly statusBarItem: any;

    constructor(params) {
        this.eventBus = params.eventBus;
        this.statusBarItem = params.statusBarItem;
        this.registerListeners();
    }

    private registerListeners() {
        this.eventBus.on(Event.MATCHING_MODE_INITIALISED, this.initialiseButton.bind(this));
        this.eventBus.on(Event.TOGGLED_CASE_SENSITIVITY, this.updateButton.bind(this));
    }

    private initialiseButton(params) {
        this.updateButton(params);

        this.statusBarItem.command = `${Const.EXTENSION_ID}.toggleModeForCaseSensitivity`;
        this.statusBarItem.show();
    }

    private updateButton({ignoreCase}) {
        const statusBarItem = this.statusBarItem;
        if (ignoreCase) {
            statusBarItem.text = 'Aa';
            statusBarItem.tooltip = `${Const.EXTENSION_NAME}: Case Insensitive Mode`;
        } else {
            statusBarItem.text = '[Aa]';
            statusBarItem.tooltip = `${Const.EXTENSION_NAME}: Case Sensitive Mode`;
        }
    }

}
