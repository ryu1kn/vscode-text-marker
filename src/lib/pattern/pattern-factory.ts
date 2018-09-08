import RegexPattern from './regex';
import StringPattern from './string';
import MatchingModeRegistry from '../matching-mode-registry';
import Pattern from './pattern';

export type PatternCreateRequest = {
    phrase: string;
    type?: string;
    ignoreCase?: boolean;
    wholeMatch?: boolean;
};

export default class PatternFactory {
    private readonly matchingModeRegistry: MatchingModeRegistry;

    constructor(matchingModeRegistry: MatchingModeRegistry) {
        this.matchingModeRegistry = matchingModeRegistry;
    }

    create(params: PatternCreateRequest): Pattern {
        const finalParams = Object.assign({}, this.matchingModeRegistry.mode, params);
        return params.type === 'RegExp' ?
            new RegexPattern(finalParams) :
            new StringPattern(finalParams);
    }

}
