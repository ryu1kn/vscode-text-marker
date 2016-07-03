
'use strict';

const _ = require('lodash');

class Throttle {
    constructor(params) {
        this._configStore = params.configStore;
    }

    throttle(callback) {
        if (this._timeout) clearTimeout(this._timeout);

        const throttlingTime = this._configStore.get('decorationRefreshDelay');
        if (_.isNumber(throttlingTime)) {
            this._timeout = setTimeout(callback, throttlingTime);
        }
    }
}

module.exports = Throttle;
