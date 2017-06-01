
const RegexPattern = require('./patterns/regex');
const StringPattern = require('./patterns/string');

class PatternFactory {

    constructor({matchingModeRegistry}) {
        this._matchingModeRegistry = matchingModeRegistry;
    }

    create(params) {
        const finalParams = Object.assign({}, this._matchingModeRegistry.mode, params);
        return params.type === 'RegExp' ?
            new RegexPattern(finalParams) :
            new StringPattern(finalParams);
    }

}

module.exports = PatternFactory;
