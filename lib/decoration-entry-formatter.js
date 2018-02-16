
class DecorationEntryFormatter {

    format(decoration) {
        const pattern = decoration.pattern;
        return {
            color: decoration.colour,
            pattern: {
                type: pattern.type,
                phrase: pattern.phrase,
                ignoreCase: pattern.ignoreCase,
                wholeMatch: pattern.wholeMatch
            }
        };
    }

}

module.exports = DecorationEntryFormatter;
