
'use strict';

const _ = require('lodash');

class Debouncer {
    constructor(params) {
        this._configStore = params.configStore;
    }

    debounce(callback) {
        if (this._timeout) clearTimeout(this._timeout);

        const waitTime = this._configStore.get('delayForRefreshingHighlight');
        if (_.isNumber(waitTime)) {
            this._timeout = setTimeout(callback, waitTime);
        }
    }
}

module.exports = Debouncer;
