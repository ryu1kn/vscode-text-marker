
const PatternAction = require('./const').PatternAction;

class PatternConverter {

    convert(pattern, convertAction) {
        switch (convertAction) {
        case PatternAction.TOGGLE_CASE_SENSITIVITY:
            return pattern.toggleCaseSensitivity();
        case PatternAction.TOGGLE_WHOLE_MATCH:
            return pattern.toggleWholeMatch();
        default:
            throw new Error(`Unknown action ${convertAction}`);
        }
    }

}

module.exports = PatternConverter;
