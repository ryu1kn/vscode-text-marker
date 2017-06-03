
class PatternConverter {

    convert(pattern, convertAction) {
        switch (convertAction) {
        case 'toggle-case-sensitivity':
            return pattern.toggleCaseSensitivity();
        case 'toggle-whole-match':
            return pattern.toggleWholeMatch();
        default:
            throw new Error(`Unknown action ${convertAction}`);
        }
    }

}

module.exports = PatternConverter;
