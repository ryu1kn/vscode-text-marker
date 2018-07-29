import * as Const from '../const';
const Event = Const.Event;

export default class ToggleWholeMatchModeButton {
    private readonly eventBus: any;
    private readonly statusBarItem: any;

    constructor(params) {
        this.eventBus = params.eventBus;
        this.statusBarItem = params.statusBarItem;
        this.registerListeners();
    }

    private registerListeners() {
        this.eventBus.on(Event.MATCHING_MODE_INITIALISED, this.initialiseButton.bind(this));
        this.eventBus.on(Event.WHOLE_MATCH_MODE_TOGGLED, this.updateButton.bind(this));
    }

    private initialiseButton(params) {
        this.updateButton(params);

        this.statusBarItem.command = `${Const.EXTENSION_ID}.toggleModeForWholeMatch`;
        this.statusBarItem.show();
    }

    private updateButton({wholeMatch}) {
        const statusBarItem = this.statusBarItem;
        if (wholeMatch) {
            statusBarItem.text = '[Ab|]';
            statusBarItem.tooltip = `${Const.EXTENSION_NAME}: Whole Match Mode`;
        } else {
            statusBarItem.text = 'Ab|';
            statusBarItem.tooltip = `${Const.EXTENSION_NAME}: Non-Whole Match Mode`;
        }
    }

}
