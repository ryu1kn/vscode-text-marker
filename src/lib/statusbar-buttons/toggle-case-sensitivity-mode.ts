import * as Const from '../const';
import EventEmitter = NodeJS.EventEmitter;
import {StatusBarItem} from 'vscode';

const Event = Const.Event;

export default class ToggleCaseSensitivityModeButton {
    private readonly eventBus: EventEmitter;
    private readonly statusBarItem: StatusBarItem;

    constructor(eventBus: EventEmitter, statusBarItem: StatusBarItem) {
        this.eventBus = eventBus;
        this.statusBarItem = statusBarItem;
        this.registerListeners();
    }

    private registerListeners() {
        this.eventBus.on(Event.MATCHING_MODE_INITIALISED, this.initialiseButton.bind(this));
        this.eventBus.on(Event.TOGGLED_CASE_SENSITIVITY, this.updateButton.bind(this));
    }

    private initialiseButton(params: {ignoreCase: boolean}) {
        this.updateButton(params);

        this.statusBarItem.command = `${Const.EXTENSION_ID}.toggleModeForCaseSensitivity`;
        this.statusBarItem.show();
    }

    private updateButton({ignoreCase}: {ignoreCase: boolean}) {
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
