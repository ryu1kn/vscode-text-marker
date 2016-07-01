
'use strict';

class Throttle {
    constructor(params) {
        this._delayMsec = params.delayMsec;
    }

    throttle(callback) {
        if (this._timeout) clearTimeout(this._timeout);
        this._timeout = setTimeout(callback, this._delayMsec);
    }
}

module.exports = Throttle;
