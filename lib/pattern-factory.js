
const RegexPattern = require('./regex-pattern');
const StringPattern = require('./string-pattern');

class PatternFactory {

    create(params) {
        return params.type === 'RegExp' ?
            new RegexPattern(params) :
            new StringPattern(params);
    }

}

module.exports = PatternFactory;
