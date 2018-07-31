import RegexPattern from './patterns/regex';
import StringPattern from './patterns/string';
import MatchingModeRegistry from './matching-mode-registry';
import Pattern from './patterns/pattern';

export default class PatternFactory {
    private readonly matchingModeRegistry: MatchingModeRegistry;

    constructor(matchingModeRegistry) {
        this.matchingModeRegistry = matchingModeRegistry;
    }

    create(params): Pattern {
        const finalParams = Object.assign({}, this.matchingModeRegistry.mode, params);
        return params.type === 'RegExp' ?
            new RegexPattern(finalParams) :
            new StringPattern(finalParams);
    }

}
