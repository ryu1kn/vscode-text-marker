
'use strict';

class Throttle {
    constructor(params) {
        this._configStore = params.configStore;
    }

    throttle(callback) {
        if (this._timeout) clearTimeout(this._timeout);

        const throttlingTime = this._configStore.get('decorationRefreshDelay');
        this._timeout = setTimeout(callback, throttlingTime);
    }
}

module.exports = Throttle;
