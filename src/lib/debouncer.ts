
const _isNumber = require('lodash.isnumber');

export default class Debouncer {
    private readonly _configStore: any;
    private _timeout: any;

    constructor(params) {
        this._configStore = params.configStore;
    }

    debounce(callback) {
        if (this._timeout) clearTimeout(this._timeout);

        const waitTime = this._configStore.get('delayForRefreshingHighlight');
        if (_isNumber(waitTime)) {
            this._timeout = setTimeout(callback, waitTime);
        }
    }

}
