
const {getInternalName} = require('./pattern-type-name');

class DecorationEntryParser {

    getPattern(decorationData) {
        const pattern = decorationData.pattern;
        return {
            type: getInternalName(pattern.type),
            phrase: pattern.expression,
            ignoreCase: pattern.ignoreCase,
            wholeMatch: pattern.wholeMatch
        };
    }

}

module.exports = DecorationEntryParser;
