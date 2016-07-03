
'use strict';

const _ = require('lodash');

class Debouncer {
    constructor(params) {
        this._configStore = params.configStore;
    }

    debounce(callback) {
        if (this._timeout) clearTimeout(this._timeout);

        const waitTime = this._configStore.get('decorationRefreshDelay');
        if (_.isNumber(waitTime)) {
            this._timeout = setTimeout(callback, waitTime);
        }
    }
}

module.exports = Debouncer;
