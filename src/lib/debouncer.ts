
const isNumber = require('lodash.isnumber');

export default class Debouncer {
    private readonly configStore: any;
    private timeout: any;

    constructor(params) {
        this.configStore = params.configStore;
    }

    debounce(callback) {
        if (this.timeout) clearTimeout(this.timeout);

        const waitTime = this.configStore.get('delayForRefreshingHighlight');
        if (isNumber(waitTime)) {
            this.timeout = setTimeout(callback, waitTime);
        }
    }

}
