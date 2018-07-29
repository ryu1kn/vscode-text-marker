import ConfigStore from './config-store';

const isNumber = require('lodash.isnumber');

export default class Debouncer {
    private readonly configStore: ConfigStore;
    private timeout: NodeJS.Timer;

    constructor(configStore) {
        this.configStore = configStore;
    }

    debounce(callback) {
        if (this.timeout) clearTimeout(this.timeout);

        const waitTime = this.configStore.get('delayForRefreshingHighlight');
        if (isNumber(waitTime)) {
            this.timeout = setTimeout(callback, waitTime);
        }
    }

}
