
const RegexPattern = require('./patterns/regex');
const StringPattern = require('./patterns/string');

class PatternFactory {

    create(params) {
        return params.type === 'RegExp' ?
            new RegexPattern(params) :
            new StringPattern(params);
    }

}

module.exports = PatternFactory;
