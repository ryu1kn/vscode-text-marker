import {Event} from './const';
import EventEmitter = NodeJS.EventEmitter;

export default class MatchingModeRegistry {
    private readonly eventBus: EventEmitter;
    private ignoreCase: boolean;
    private wholeMatch: boolean;

    constructor(ignoreCase, wholeMatch, eventBus) {
        this.eventBus = eventBus;
        this.ignoreCase = ignoreCase;
        this.wholeMatch = wholeMatch;
        this.broadcastReady();
    }

    private broadcastReady() {
        this.eventBus.once(Event.EXTENSION_READY, () => {
            this.eventBus.emit(Event.MATCHING_MODE_INITIALISED, this.mode);
        });
    }

    toggleCaseSensitivity() {
        this.ignoreCase = !this.ignoreCase;
        this.eventBus.emit(Event.TOGGLED_CASE_SENSITIVITY, {ignoreCase: this.ignoreCase});
    }

    toggleWholeMatch() {
        this.wholeMatch = !this.wholeMatch;
        this.eventBus.emit(Event.WHOLE_MATCH_MODE_TOGGLED, {wholeMatch: this.wholeMatch});
    }

    get mode() {
        return {
            ignoreCase: this.ignoreCase,
            wholeMatch: this.wholeMatch
        };
    }

}
